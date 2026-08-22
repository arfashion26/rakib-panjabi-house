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

    // Step 1: Check if a user with this phone already exists in profiles
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id, email")
      .eq("phone", phone)
      .maybeSingle();

    if (existingProfile) {
      return { userId: existingProfile.id, isNewUser: false };
    }

    // Step 2: Check by email if provided
    if (email) {
      const { data: existingByEmail } = await admin
        .from("profiles")
        .select("id, phone")
        .eq("email", email)
        .maybeSingle();

      if (existingByEmail) {
        // Update their phone number
        await admin
          .from("profiles")
          .update({ phone })
          .eq("id", existingByEmail.id);
        return { userId: existingByEmail.id, isNewUser: false };
      }
    }

    // Step 3: Create a new user account
    // Generate a phone-based email that customers can use to login
    // Format: 8801716243949@alrakib.com — customer types their phone to login
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const userEmail = email || `${cleanPhone}@alrakib.com`;

    // Generate a random temporary password (user can reset it later)
    const tempPassword = generateTempPassword();

    // Create auth user via Admin API
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email: userEmail,
      password: tempPassword,
      phone: phone,
      email_confirm: true, // Auto-confirm since they placed an order
      phone_confirm: true,
      user_metadata: {
        full_name: name,
        name: name,
        phone: phone,
        source: "guest_checkout",
      },
    });

    if (createError || !newUser.user) {
      console.error("Failed to create user:", createError);
      return { userId: null, isNewUser: false };
    }

    // Update the profile with phone (the trigger creates the profile,
    // but we need to ensure phone is set)
    await admin
      .from("profiles")
      .update({
        phone: phone,
        name: name,
      })
      .eq("id", newUser.user.id);

    return {
      userId: newUser.user.id,
      isNewUser: true,
      tempPassword,
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

    if (!userResult.userId) {
      return {
        success: false,
        error: "Failed to create user account. Please try again.",
      };
    }

    // Step 2: Create the order
    const admin = createAdminClient();
    const shippingAddressJson = JSON.stringify({
      name: data.name,
      phone: data.phone,
      address: data.address,
      area: data.area,
    });

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        user_id: userResult.userId,
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
        customer_email: userResult.userId ? userEmail : `${data.phone.replace(/[^0-9]/g, "")}@alrakib.com`,
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
      user_id: userResult.userId,
      type: "order_placed",
      title: "Order Placed Successfully",
      message: `Your order ${order.order_number} has been placed successfully.`,
      data: { order_id: order.id, order_number: order.order_number },
    });

    revalidatePath("/admin/orders");

    return {
      success: true,
      orderNumber: order.order_number,
      isNewUser: userResult.isNewUser,
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
