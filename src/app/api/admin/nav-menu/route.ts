import { NextRequest, NextResponse } from "next/server";
import {
  getAllNavItems,
  createNavItem,
  seedNavItems,
} from "@/lib/services/nav-menu";

export async function GET() {
  try {
    // Auto-seed if empty
    await seedNavItems();
    const items = await getAllNavItems();
    return NextResponse.json({ success: true, items });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { label, label_bn, href, icon, sort_order, is_active, open_in_new_tab } = body;

    if (!label || !href) {
      return NextResponse.json(
        { success: false, error: "Label and URL are required" },
        { status: 400 }
      );
    }

    const result = await createNavItem({
      label: label.trim(),
      label_bn: (label_bn || "").trim(),
      href: href.trim(),
      icon: icon || null,
      sort_order: Number(sort_order) || 0,
      is_active: is_active !== false,
      open_in_new_tab: open_in_new_tab === true,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
