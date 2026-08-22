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

  // Update last_login_at
  if (data.user) {
    try {
      const admin = createAdminClient();
      await admin
        .from("profiles")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", data.user.id);
    } catch (e) {
      console.error("Failed to update last_login_at:", e);
    }
  }

  return { success: true, user: data.user };
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
