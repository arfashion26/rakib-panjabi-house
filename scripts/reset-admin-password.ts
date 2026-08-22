// Reset super admin password
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://diraphksavgifippktuh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcmFwaGtzYXZnaWZpcHBrdHVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM2OTY3NCwiZXhwIjoyMTAyOTQ1Njc0fQ.KKX0SyFymw-9QbHIhVa6WtbWN6_jUes7aOYx75yFigA";

const SUPER_ADMIN_EMAIL = "arfashion243949@gmail.com";
const SUPER_ADMIN_PASSWORD = "RPH@SuperAdmin#2026!Xk9";

async function resetPassword() {
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Find user by email
  const { data: users, error: listError } = await admin.auth.admin.listUsers();

  if (listError) {
    console.log("Error listing users:", listError.message);
    return;
  }

  const user = users.users.find(
    (u) => u.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
  );

  if (!user) {
    console.log("User not found! Creating new one...");
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: "Super Admin",
        name: "Super Admin",
        role: "SUPER_ADMIN",
      },
    });

    if (createError) {
      console.log("Create error:", createError.message);
      return;
    }

    // Update profile
    await admin.from("profiles").upsert({
      id: newUser.user.id,
      email: SUPER_ADMIN_EMAIL,
      name: "Super Admin",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    }, { onConflict: "id" });

    console.log("✓ Super admin created!");
    return;
  }

  // Update password
  console.log("Found user:", user.id);
  const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
    password: SUPER_ADMIN_PASSWORD,
    email_confirm: true,
  });

  if (updateError) {
    console.log("Password update error:", updateError.message);
    return;
  }

  // Ensure profile has SUPER_ADMIN role
  await admin.from("profiles").upsert({
    id: user.id,
    email: SUPER_ADMIN_EMAIL,
    name: "Super Admin",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
  }, { onConflict: "id" });

  console.log("✓ Password reset successfully!");
  console.log("Email:", SUPER_ADMIN_EMAIL);
  console.log("Password:", SUPER_ADMIN_PASSWORD);
}

resetPassword().catch(console.error);
