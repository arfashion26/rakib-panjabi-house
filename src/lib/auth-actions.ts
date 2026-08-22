"use server";

import { createServerClientHelper, createAdminClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Sign up a new user with email and password.
 * NO email verification required — user can login immediately.
 *
 * Flow:
 * 1. Create auth user via supabase.auth.signUp
 * 2. Auto-confirm email using admin API (bypass email verification)
 * 3. Update profile with phone number
 * 4. Try to sign in immediately (so user gets a session)
 */
export async function signUpWithEmail({
  email,
  password,
  name,
  phone,
}: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}) {
  const supabase = await createServerClientHelper();

  // Step 1: Create the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        name,
        phone,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: "Failed to create user account." };
  }

  // Step 2: Auto-confirm email using admin API (bypass email verification)
  try {
    const admin = createAdminClient();
    await admin.auth.admin.updateUserById(data.user.id, {
      email_confirm: true,
    });

    // Step 3: Update profile with phone and name
    await admin
      .from("profiles")
      .update({ phone, name })
      .eq("id", data.user.id);
  } catch (e: any) {
    console.error("Auto-confirm failed:", e?.message || e);
    // Continue anyway — the user was created
  }

  // Step 4: Try to sign in immediately
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    // User was created but auto-login failed
    // They can login manually from /login
    return {
      success: true,
      user: data.user,
      needsEmailConfirmation: false,
      autoLoginFailed: true,
    };
  }

  return {
    success: true,
    user: signInData.user || data.user,
    needsEmailConfirmation: false,
  };
}

/**
 * Sign in with email and password.
 * Returns the redirect URL based on user's role.
 */
export async function signInWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = await createServerClientHelper();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  let redirectTo = "/dashboard"; // default for customers
  let role = "CUSTOMER";

  // Fetch user's profile to determine role
  if (data.user) {
    try {
      const admin = createAdminClient();
      await admin
        .from("profiles")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", data.user.id);

      const { data: profile } = await admin
        .from("profiles")
        .select("role, status")
        .eq("id", data.user.id)
        .single();

      if (profile) {
        role = profile.role;

        // Check if account is suspended
        if (profile.status === "SUSPENDED") {
          await supabase.auth.signOut();
          return {
            success: false,
            error: "Your account has been suspended. Please contact support.",
          };
        }

        // Redirect based on role
        if (["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"].includes(profile.role)) {
          redirectTo = "/admin";
        }
      }
    } catch (e) {
      console.error("Failed to fetch profile:", e);
    }
  }

  return { success: true, user: data.user, redirectTo, role };
}

/**
 * Sign in with Google OAuth.
 * Returns the OAuth URL that the client should redirect to.
 */
export async function signInWithGoogle(redirectAfter: string = "/") {
  const supabase = await createServerClientHelper();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/auth/callback?next=${encodeURIComponent(redirectAfter)}`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, url: data.url };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const supabase = await createServerClientHelper();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Send a password reset email.
 */
export async function resetPassword(email: string) {
  const supabase = await createServerClientHelper();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/auth/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get the current user's profile (server-side).
 */
export async function getCurrentUser() {
  const supabase = await createServerClientHelper();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}
