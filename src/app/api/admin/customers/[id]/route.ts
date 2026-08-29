import { NextRequest, NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

/**
 * Verify admin access — returns the admin's profile or null.
 */
async function verifyAdmin() {
  const supabase = await createServerClientHelper();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status !== "ACTIVE") return null;
  if (!["SUPER_ADMIN", "ADMIN"].includes(profile.role)) return null;
  return profile;
}

/**
 * DELETE /api/admin/customers/[id]
 *
 * Deletes a customer account. This is a SOFT delete by default:
 *  - The auth user is deleted (they can no longer log in)
 *  - The profile is marked as status='DELETED' (preserved for order history)
 *  - Orders, addresses, reviews, etc. are preserved (foreign keys reference user_id)
 *
 * Only SUPER_ADMIN and ADMIN can delete customers.
 * Cannot delete other admin accounts (use /api/admin/update-user-role for that).
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const admin = createAdminClient();

    // Fetch the target user
    const { data: targetUser, error: fetchErr } = await admin
      .from("profiles")
      .select("id, email, role, status")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr || !targetUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Safety: don't allow deleting admin/staff accounts from here
    if (["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"].includes(targetUser.role)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cannot delete admin/staff accounts from here. Demote to customer first, then delete.",
        },
        { status: 400 }
      );
    }

    // Safety: don't allow admin to delete themselves
    if (id === adminProfile.id) {
      return NextResponse.json(
        { success: false, error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // Step 1: Mark profile as DELETED (soft delete — preserve for order history)
    const { error: profileErr } = await admin
      .from("profiles")
      .update({
        status: "DELETED",
        email: `deleted+${id}@alrakib.com`, // anonymize email
        phone: null,
        name: "Deleted Customer",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (profileErr) {
      console.error("Profile soft-delete error:", profileErr);
      return NextResponse.json(
        { success: false, error: "Failed to update customer profile" },
        { status: 500 }
      );
    }

    // Step 2: Delete the auth user (they can no longer log in)
    // This also invalidates any active sessions.
    const { error: authErr } = await admin.auth.admin.deleteUser(id);
    if (authErr) {
      console.error("Auth user delete error:", authErr.message);
      // Don't fail the whole operation — the profile is already anonymized
      // and marked as DELETED, so the user effectively no longer exists.
    }

    return NextResponse.json({
      success: true,
      message: `Customer ${targetUser.email} has been deleted. Their orders are preserved for record-keeping.`,
    });
  } catch (error: any) {
    console.error("Delete customer error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
