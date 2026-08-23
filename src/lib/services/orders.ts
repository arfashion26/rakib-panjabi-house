"use server";

import { createServerClientHelper, createAdminClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

/**
 * Check if the database is ready (tables exist and accessible).
 */
async function isDatabaseReady(): Promise<boolean> {
  try {
    const supabase = await createServerClientHelper();
    const { count, error } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });
    if (error) return false;
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}

/**
 * Find or create a user by phone number.
 *
 * When a guest places an order, we automatically create an account
 * for them using their phone number. This way:
 * - They can track their order
 * - They receive order updates
 * - Their order history is saved
 * - They can login later with their phone/email
 *
 * Returns the user's UUID.
 */
export async function findOrCreateUserByPhone(
  name: string,
  phone: string,
  email?: string
): Promise<{ userId: string | null; isNewUser: boolean; tempPassword?: string }> {
  try {
    const admin = createAdminClient();

    // Normalize phone: 01716... → 8801716...
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    let normalizedPhone = cleanPhone;
    if (cleanPhone.startsWith("01")) {
      normalizedPhone = "88" + cleanPhone;
    }

    // Step 1: Check if user exists by phone in profiles table
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id, email, phone")
      .or(`phone.eq.${phone},phone.eq.+${normalizedPhone},phone.eq.${cleanPhone}`)
      .maybeSingle();

    if (existingProfile) {
      return { userId: existingProfile.id, isNewUser: false };
    }

    // Step 2: Check by email
    const userEmail = email || `${normalizedPhone}@alrakib.com`;
    const { data: existingByEmail } = await admin
      .from("profiles")
      .select("id, phone")
      .eq("email", userEmail)
      .maybeSingle();

    if (existingByEmail) {
      // Update phone if missing
      await admin.from("profiles").update({ phone, name }).eq("id", existingByEmail.id);
      return { userId: existingByEmail.id, isNewUser: false };
    }

    // Step 3: Create new user
    const userPassword = `Rph${normalizedPhone}!`;

    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email: userEmail,
      password: userPassword,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        name: name,
        phone: phone,
        source: "guest_checkout",
      },
    });

    if (createError || !newUser.user) {
      console.error("createUser error:", createError?.message);

      // If user already exists in auth.users but not in profiles,
      // try to find them and create the profile
      const { data: allUsers } = await admin.auth.admin.listUsers();
      const found = allUsers?.users?.find(
        (u) => u.email?.toLowerCase() === userEmail.toLowerCase()
      );

      if (found) {
        // Create/update profile
        await admin.from("profiles").upsert({
          id: found.id,
          email: userEmail,
          name,
          phone,
          role: "CUSTOMER",
          status: "ACTIVE",
        }, { onConflict: "id" });
        return { userId: found.id, isNewUser: false };
      }

      // Last resort: return null, order will use guest user
      return { userId: null, isNewUser: false };
    }

    // Step 4: Update profile with phone and name
    await admin.from("profiles").upsert({
      id: newUser.user.id,
      email: userEmail,
      name,
      phone,
      role: "CUSTOMER",
      status: "ACTIVE",
    }, { onConflict: "id" });

    return {
      userId: newUser.user.id,
      isNewUser: true,
      tempPassword: normalizedPhone,
    };
  } catch (error) {
    console.error("Error in findOrCreateUserByPhone:", error);
    return { userId: null, isNewUser: false };
  }
}

/**
 * Generate a random temporary password.
 */
function generateTempPassword(): string {
  const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password + "@1"; // Ensure meets password requirements
}

/**
 * Place an order.
 *
 * This function:
 * 1. Finds or creates a user account based on phone number
 * 2. Creates the order in the database
 * 3. Creates order items
 * 4. Creates a tracking history entry
 * 5. Returns the order details
 *
 * If the database is not yet configured, it simulates the order
 * and returns a placeholder order number.
 */
export async function placeOrder(data: {
  name: string;
  phone: string;
  address: string;
  area: "inside_dhaka" | "outside_dhaka";
  payment: string;
  note?: string;
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    discountPrice: number | null;
    quantity: number;
    selectedSize: string | null;
    selectedColor: string | null;
  }>;
  subtotal: number;
  shippingCost: number;
  codCharge: number;
  total: number;
}): Promise<{
  success: boolean;
  orderNumber?: string;
  isNewUser?: boolean;
  tempPassword?: string;
  error?: string;
}> {
  try {
    const dbReady = await isDatabaseReady();

    if (!dbReady) {
      // Database not configured — simulate order (for development/preview)
      const orderNumber = `RPH-${new Date()
        .toISOString()
        .slice(2, 10)
        .replace(/-/g, "")}-${Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")}`;

      return {
        success: true,
        orderNumber,
        isNewUser: true,
        tempPassword: "(database not connected — no actual account created)",
      };
    }

    // Step 1: Find or create user
    const userResult = await findOrCreateUserByPhone(data.name, data.phone);

    console.log("Order: user creation result:", {
      userId: userResult.userId,
      isNewUser: userResult.isNewUser,
      phone: data.phone,
    });

    // If user creation failed, use the guest user ID as fallback
    const GUEST_USER_ID = "ae195301-694b-4893-a5f5-dae705ac1508";
    const userId = userResult.userId || GUEST_USER_ID;

    // Determine if this is a "new user" for the success page
    // Even if using guest fallback, if user was newly created, flag it
    const isNewUser = userResult.isNewUser;

    // Step 2: Create the order
    const admin = createAdminClient();
    const shippingAddressJson = JSON.stringify({
      name: data.name,
      phone: data.phone,
      address: data.address,
      area: data.area,
    });

    // Normalize phone for email
    let normalizedPhone = data.phone.replace(/[^0-9]/g, "");
    if (normalizedPhone.startsWith("01")) {
      normalizedPhone = "88" + normalizedPhone;
    }
    const customerEmail = `${normalizedPhone}@alrakib.com`;

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        user_id: userId,
        status: "PENDING",
        payment_status: data.payment === "cod" ? "UNPAID" : "PENDING",
        fulfillment_status: "UNFULFILLED",
        subtotal: data.subtotal,
        discount_total: 0,
        shipping_total: data.shippingCost,
        tax_total: 0,
        grand_total: data.total,
        currency: "BDT",
        customer_name: data.name,
        customer_email: customerEmail,
        customer_phone: data.phone,
        shipping_address_json: shippingAddressJson,
        payment_method: data.payment,
        customer_note: data.note || null,
        source: "WEB",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);
      return {
        success: false,
        error: "Failed to create order. Please try again.",
      };
    }

    // Step 3: Create order items
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      discount_price: item.discountPrice,
      total: (item.discountPrice ?? item.price) * item.quantity,
      selected_size: item.selectedSize,
      selected_color: item.selectedColor,
      product_snapshot: JSON.stringify({
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        price: item.price,
        discountPrice: item.discountPrice,
      }),
    }));

    const { error: itemsError } = await admin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
    }

    // Step 4: Create tracking history entry
    await admin.from("order_tracking_history").insert({
      order_id: order.id,
      status: "ORDER_PLACED",
      message: `Order placed by ${data.name} via ${data.payment === "cod" ? "Cash on Delivery" : data.payment}`,
      timestamp: new Date().toISOString(),
    });

    // Step 5: Create a notification for admins (optional)
    await admin.from("notifications").insert({
      user_id: userId,
      type: "order_placed",
      title: "Order Placed Successfully",
      message: `Your order ${order.order_number} has been placed successfully.`,
      data: { order_id: order.id, order_number: order.order_number },
    });

    revalidatePath("/admin/orders");

    return {
      success: true,
      orderNumber: order.order_number,
      isNewUser,
      tempPassword: userResult.tempPassword,
    };
  } catch (error: any) {
    console.error("Place order error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred.",
    };
  }
}
