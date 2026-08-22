// Create a guest user for guest orders
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://diraphksavgifippktuh.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcmFwaGtzYXZnaWZpcHBrdHVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM2OTY3NCwiZXhwIjoyMTAyOTQ1Njc0fQ.KKX0SyFymw-9QbHIhVa6WtbWN6_jUes7aOYx75yFigA";

async function run() {
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Check if guest user already exists
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  const guestEmail = "guest@alrakib.com";
  const found = existingUsers?.users?.find(
    (u) => u.email?.toLowerCase() === guestEmail
  );

  if (found) {
    console.log("Guest user already exists:", found.id);
    // Update profile
    await admin.from("profiles").upsert({
      id: found.id,
      email: guestEmail,
      name: "Guest Customer",
      role: "CUSTOMER",
      status: "ACTIVE",
    }, { onConflict: "id" });
    console.log("Profile updated");
    return;
  }

  // Create guest user
  const { data: newUser, error } = await admin.auth.admin.createUser({
    email: guestEmail,
    password: "GuestUser!2026",
    email_confirm: true,
    user_metadata: {
      full_name: "Guest Customer",
      name: "Guest Customer",
      source: "system_guest",
    },
  });

  if (error) {
    console.log("Error:", error.message);
    return;
  }

  // Update profile
  await admin.from("profiles").upsert({
    id: newUser.user.id,
    email: guestEmail,
    name: "Guest Customer",
    role: "CUSTOMER",
    status: "ACTIVE",
  }, { onConflict: "id" });

  console.log("✓ Guest user created:", newUser.user.id);
}

run().catch(console.error);
