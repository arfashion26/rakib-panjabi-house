"use server";

import { createAdminClient } from "@/lib/supabase";

/**
 * Promote a user to SUPER_ADMIN by email.
 *
 * SECURITY: This only works if NO super admin exists yet (first-time setup).
 * Once a super admin exists, this function refuses to run.
 * The existing super admin must promote other users via SQL or admin panel.
 *
 * Usage: Call from a server component or use the setup page at /setup-admin
 */
export async function promoteFirstAdmin(email: string) {
  try {
    const admin = createAdminClient();

    // Step 1: Check if any SUPER_ADMIN already exists
    const { data: existingAdmins, error: checkError } = await admin
      .from("profiles")
      .select("id, email")
      .eq("role", "SUPER_ADMIN")
      .limit(1);

    if (checkError) {
      return {
        success: false,
        error: `Database check failed: ${checkError.message}`,
      };
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return {
        success: false,
        error:
          "A super admin already exists. For security, this setup can only be used once. " +
          "Ask the existing super admin to promote more admins via the admin panel or SQL.",
      };
    }

    // Step 2: Find the user by email
    const { data: profile, error: findError } = await admin
      .from("profiles")
      .select("id, email, name, role")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (findError || !profile) {
      return {
        success: false,
        error: `No user found with email "${email}". Please register an account first at /register, then try again.`,
      };
    }

    // Step 3: Promote to SUPER_ADMIN
    const { error: updateError } = await admin
      .from("profiles")
      .update({ role: "SUPER_ADMIN", status: "ACTIVE" })
      .eq("id", profile.id);

    if (updateError) {
      return {
        success: false,
        error: `Failed to promote user: ${updateError.message}`,
      };
    }

    return {
      success: true,
      message: `Successfully promoted ${profile.email} to SUPER_ADMIN! You can now login at /admin/login.`,
      profile: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unexpected error occurred.",
    };
  }
}

/**
 * Check if any super admin exists.
 */
export async function hasSuperAdmin(): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { count } = await admin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "SUPER_ADMIN");
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}
