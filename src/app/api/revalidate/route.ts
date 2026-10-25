import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * POST /api/revalidate
 * Purges the Next.js cache for the homepage (and optionally other paths).
 * Called by the admin homepage editor after saving changes, so new
 * slides/content appear immediately instead of waiting for ISR (24h).
 *
 * Body: { paths?: string[] }
 *   - paths: optional array of paths to revalidate (default: ["/"])
 *
 * No auth required — this is a lightweight cache purge. The admin
 * dashboard is the only caller, and the revalidation is harmless even
 * if called by an attacker (worst case: cache is rebuilt slightly
 * sooner than necessary).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const paths: string[] = body.paths || ["/"];

    const results: Record<string, boolean> = {};
    for (const path of paths) {
      try {
        revalidatePath(path);
        results[path] = true;
      } catch (e: any) {
        results[path] = false;
      }
    }

    return NextResponse.json({ success: true, revalidated: results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Revalidation failed" },
      { status: 500 }
    );
  }
}
