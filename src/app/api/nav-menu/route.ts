import { NextResponse } from "next/server";
import { getActiveNavItems } from "@/lib/services/nav-menu";

export async function GET() {
  try {
    const items = await getActiveNavItems();
    return NextResponse.json({ success: true, items });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
