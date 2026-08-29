import { NextRequest, NextResponse } from "next/server";
import { getPaymentConfig, updatePaymentConfig } from "@/lib/services/settings";
import type { PaymentConfig } from "@/lib/payment-config";

/**
 * GET /api/admin/payment-config
 * Returns the current payment method configuration (admin only).
 */
export async function GET() {
  try {
    const config = await getPaymentConfig();
    return NextResponse.json({ success: true, config });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/payment-config
 * Body: { cod_enabled, bkash_enabled, ... }
 * Updates the payment method configuration (admin only).
 */
export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<PaymentConfig>;

    // Merge with current config (so partial updates work)
    const current = await getPaymentConfig();
    const next: PaymentConfig = {
      ...current,
      ...body,
    };

    // Always ensure COD is enabled (it's the fallback)
    if (!next.cod_enabled) {
      // Allow disabling COD only if at least one other method is enabled
      const anyOther =
        next.bkash_enabled ||
        next.nagad_enabled ||
        next.rocket_enabled ||
        next.sslcommerz_enabled ||
        next.stripe_enabled;
      if (!anyOther) {
        return NextResponse.json(
          {
            success: false,
            error:
              "At least one payment method must be enabled. Cash on Delivery cannot be disabled when no other method is active.",
          },
          { status: 400 }
        );
      }
    }

    const ok = await updatePaymentConfig(next);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Failed to update payment configuration" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, config: next });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
