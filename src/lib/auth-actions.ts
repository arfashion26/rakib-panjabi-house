"use server";

import { createServerClientHelper, createAdminClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Sign up a new user with email and password.
 * Supabase will create the auth.users entry and our trigger
 * will auto-create a profile entry.
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

  // If user is immediately created (no email confirmation needed),
  // update their profile with phone.
  if (data.user && phone) {
    try {
      const admin = createAdminClient();
      await admin
        .from("profiles")
        .update({ phone, name })
        .eq("id", data.user.id);
    } catch (e) {
      console.error("Failed to update profile phone:", e);
    }
  }

  return {
    success: true,
    user: data.user,
    needsEmailConfirmation: !data.session,
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
