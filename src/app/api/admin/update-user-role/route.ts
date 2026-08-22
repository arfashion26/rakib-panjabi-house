import { NextRequest, NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

/**
 * POST /api/admin/update-user-role
 * Updates a user's role. Only SUPER_ADMIN can promote/demote.
 *
 * Body:
 *   - userId: string
 *   - role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "STAFF" | "CUSTOMER"
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: "userId and role are required" },
        { status: 400 }
      );
    }

    const validRoles = ["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF", "CUSTOMER"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role" },
        { status: 400 }
      );
    }

    // Check current user is SUPER_ADMIN
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
      .select("role, status, id")
      .eq("id", user.id)
      .single();

    if (!currentUserProfile || currentUserProfile.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Only Super Admin can change user roles" },
        { status: 403 }
      );
    }

    // Prevent self-demotion (super admin can't demote themselves)
    if (userId === currentUserProfile.id && role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "You cannot demote yourself. Ask another Super Admin.",
        },
        { status: 400 }
      );
    }

    // Check target user exists
    const { data: targetUser } = await admin
      .from("profiles")
      .select("id, email, role")
      .eq("id", userId)
      .single();

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Update the role
    const { error: updateError } = await admin
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Role updated to ${role} for ${targetUser.email}`,
    });
  } catch (error: any) {
    console.error("Update role error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
