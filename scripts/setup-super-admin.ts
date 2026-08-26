/**
 * Setup Super Admin Account
 *
 * Run: bun run scripts/setup-super-admin.ts
 *
 * This creates a super admin account directly in Supabase:
 * - Email: arfashion243949@gmail.com
 * - Password: RPH@SuperAdmin#2026!Xk9
 * - Role: SUPER_ADMIN
 *
 * After running this, login at /admin/login
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://diraphksavgifippktuh.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcmFwaGtzYXZnaWZpcHBrdHVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM2OTY3NCwiZXhwIjoyMTAyOTQ1Njc0fQ.KKX0SyFymw-9QbHIhVa6WtbWN6_jUes7aOYx75yFigA";

const SUPER_ADMIN_EMAIL = "arfashion243949@gmail.com";
const SUPER_ADMIN_PASSWORD = "RPH@SuperAdmin#2026!Xk9";
const SUPER_ADMIN_NAME = "Super Admin";

async function setupSuperAdmin() {
  console.log("=".repeat(60));
  console.log("Setting up Super Admin Account");
  console.log("=".repeat(60));

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Step 1: Check if super admin already exists
  console.log("\n1. Checking if super admin already exists...");
  const { data: existingAdmins, error: checkError } = await admin
    .from("profiles")
    .select("id, email, name, role")
    .eq("role", "SUPER_ADMIN");

  if (checkError) {
    console.log("   ⚠ Could not check existing admins:", checkError.message);
    console.log("   (Database may not be set up yet. Run 0001_init.sql first!)");
    return;
  }

  if (existingAdmins && existingAdmins.length > 0) {
    console.log("   ℹ Super admin already exists:");
    existingAdmins.forEach((a) => {
      console.log(`     - ${a.email} (${a.name})`);
    });
    console.log("\n   To create more admins, use the admin panel after login.");
    return;
  }
  console.log("   ✓ No super admin exists yet. Proceeding...");

  // Step 2: Check if auth user already exists
  console.log("\n2. Checking if auth user already exists...");
  const { data: existingUsers, error: userCheckError } = await admin.auth.admin.listUsers();

  let existingUserId: string | null = null;

  if (!userCheckError && existingUsers.users) {
    const found = existingUsers.users.find(
      (u) => u.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
    );
    if (found) {
      existingUserId = found.id;
      console.log(`   ℹ User already exists: ${found.email} (${found.id})`);
    }
  }

  // Step 3: Create or update auth user
  console.log("\n3. Creating/updating auth user...");
  let userId: string;

  if (existingUserId) {
    // Update existing user's password
    const { data: updated, error: updateError } = await admin.auth.admin.updateUserById(
      existingUserId,
      {
        password: SUPER_ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: SUPER_ADMIN_NAME,
          name: SUPER_ADMIN_NAME,
          role: "SUPER_ADMIN",
        },
      }
    );
    if (updateError) {
      console.log("   ✗ Failed to update user:", updateError.message);
      return;
    }
    userId = existingUserId;
    console.log(`   ✓ Password updated for existing user`);
  } else {
    // Create new user
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: SUPER_ADMIN_NAME,
        name: SUPER_ADMIN_NAME,
        role: "SUPER_ADMIN",
      },
    });

    if (createError) {
      console.log("   ✗ Failed to create user:", createError.message);
      return;
    }
    userId = newUser.user.id;
    console.log(`   ✓ User created: ${newUser.user.email}`);
  }

  // Step 4: Update profile to SUPER_ADMIN role
  console.log("\n4. Setting role to SUPER_ADMIN in profiles table...");
  const { error: upsertError } = await admin.from("profiles").upsert(
    {
      id: userId,
      email: SUPER_ADMIN_EMAIL,
      name: SUPER_ADMIN_NAME,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
    { onConflict: "id" }
  );

  if (upsertError) {
    console.log("   ✗ Failed to update profile:", upsertError.message);
    console.log("   (Database may not be set up yet. Run 0001_init.sql first!)");
    return;
  }
  console.log("   ✓ Profile updated: role = SUPER_ADMIN, status = ACTIVE");

  // Step 5: Verify
  console.log("\n5. Verifying setup...");
  const { data: verify } = await admin
    .from("profiles")
    .select("id, email, name, role, status")
    .eq("id", userId)
    .single();

  if (verify) {
    console.log("   ✓ Verified:");
    console.log(`     Email: ${verify.email}`);
    console.log(`     Name:  ${verify.name}`);
    console.log(`     Role:  ${verify.role}`);
    console.log(`     Status: ${verify.status}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✓ SUPER ADMIN SETUP COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Login Credentials:");
  console.log(`   Email:    ${SUPER_ADMIN_EMAIL}`);
  console.log(`   Password: ${SUPER_ADMIN_PASSWORD}`);
  console.log("\n🔐 Login URL: https://rakib-panjabi-house.vercel.app/admin/login");
  console.log("\n⚠ IMPORTANT: Save these credentials in a secure password manager.");
  console.log("   After first login, you can change the password in Settings.");
  console.log("   You can also create more admins/staff from Admin → Customers page.\n");
}

setupSuperAdmin().catch(console.error);
