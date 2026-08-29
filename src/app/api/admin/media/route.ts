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
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status !== "ACTIVE") return null;
  if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(profile.role)) return null;
  return profile;
}

const BUCKET_NAME = "homepage-images";

/**
 * GET /api/admin/media?folder=hero
 *
 * Lists all images in the homepage-images bucket.
 * Optional ?folder=xxx to filter by folder.
 *
 * Returns: { success: true, images: [{ name, path, url, size, created_at }] }
 */
export async function GET(req: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const folder = req.nextUrl.searchParams.get("folder");

    // List all files in the bucket
    const { data: files, error } = await admin.storage
      .from(BUCKET_NAME)
      .list(folder || "", {
        limit: 1000,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("Storage list error:", error.message);
      return NextResponse.json(
        { success: false, error: "Failed to list images: " + error.message },
        { status: 500 }
      );
    }

    // Filter: only images (skip folders, which have no id)
    const images = (files || [])
      .filter((f) => f.id !== null) // folders have null id
      .map((f) => {
        const path = folder ? `${folder}/${f.name}` : f.name;
        const { data: urlData } = admin.storage.from(BUCKET_NAME).getPublicUrl(path);
        return {
          name: f.name,
          path: path,
          url: urlData.publicUrl,
          size: f.metadata?.size || 0,
          created_at: f.created_at || "",
          folder: folder || "root",
        };
      });

    // If no folder specified, also fetch from all subfolders
    if (!folder) {
      // Get top-level folders (entries with null id)
      const folders = (files || []).filter((f) => f.id === null).map((f) => f.name);

      // Fetch images from each subfolder
      for (const subFolder of folders) {
        const { data: subFiles } = await admin.storage
          .from(BUCKET_NAME)
          .list(subFolder, {
            limit: 1000,
            sortBy: { column: "created_at", order: "desc" },
          });

        if (subFiles) {
          for (const f of subFiles) {
            if (f.id === null) continue; // skip nested folders
            const path = `${subFolder}/${f.name}`;
            const { data: urlData } = admin.storage.from(BUCKET_NAME).getPublicUrl(path);
            images.push({
              name: f.name,
              path: path,
              url: urlData.publicUrl,
              size: f.metadata?.size || 0,
              created_at: f.created_at || "",
              folder: subFolder,
            });
          }
        }
      }

      // Sort all images by created_at descending
      images.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    }

    return NextResponse.json({
      success: true,
      images,
      count: images.length,
    });
  } catch (e: any) {
    console.error("Media list API error:", e);
    return NextResponse.json(
      { success: false, error: e.message || "Server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/media?path=hero/12345-abc.jpg
 *
 * Deletes an image from Supabase Storage.
 */
export async function DELETE(req: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const path = req.nextUrl.searchParams.get("path");
    if (!path) {
      return NextResponse.json(
        { success: false, error: "Image path is required" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Delete the file from storage
    const { error } = await admin.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      console.error("Storage delete error:", error.message);
      return NextResponse.json(
        { success: false, error: "Failed to delete image: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (e: any) {
    console.error("Media delete API error:", e);
    return NextResponse.json(
      { success: false, error: e.message || "Server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/media
 *
 * Upload a new image to Supabase Storage.
 * Form data: file (required), folder (optional, default: "general")
 */
export async function POST(request: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPG, PNG, WebP, and GIF images are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Image must be less than 5MB" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${ext}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await admin.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      return NextResponse.json(
        { success: false, error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = admin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: fileName,
    });
  } catch (error: any) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
