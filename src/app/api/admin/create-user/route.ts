import { NextRequest, NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

/**
 * POST /api/admin/create-user
 * Creates a new staff/admin user. Only SUPER_ADMIN or ADMIN can do this.
 *
 * Body:
 *   - name: string
 *   - email: string
 *   - password: string (min 8 chars)
 *   - role: "ADMIN" | "MANAGER" | "STAFF"
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (!["ADMIN", "MANAGER", "STAFF"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role. Can only create ADMIN, MANAGER, or STAFF." },
        { status: 400 }
      );
    }

    // Check if current user is SUPER_ADMIN or ADMIN
    const supabase = await createServerClientHelper();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    const { data: currentUserProfile } = await admin
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();

    if (!currentUserProfile || currentUserProfile.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "Account suspended" },
        { status: 403 }
      );
    }

    if (!["SUPER_ADMIN", "ADMIN"].includes(currentUserProfile.role)) {
      return NextResponse.json(
        { success: false, error: "Only Super Admin or Admin can create new users" },
        { status: 403 }
      );
    }

    // Create the auth user via admin API
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        name,
        role,
        created_by: user.id,
      },
    });

    if (createError) {
      return NextResponse.json(
        { success: false, error: createError.message },
        { status: 400 }
      );
    }

    // Update the profile (the trigger creates it, we update with role + name)
    const { error: profileError } = await admin
      .from("profiles")
      .update({
        name,
        role,
        status: "ACTIVE",
      })
      .eq("id", newUser.user.id);

    if (profileError) {
      console.error("Profile update error:", profileError);
      // User was created, but profile update failed — still return success
    }

    return NextResponse.json({
      success: true,
      message: `${name} created with role ${role}`,
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        name,
        role,
      },
    });
  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
