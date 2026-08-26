import { NextResponse } from "next/server";
import { getPaymentConfig } from "@/lib/services/settings";
import { PAYMENT_METHODS_META } from "@/lib/payment-config";

/**
 * GET /api/payment-methods
 *
 * Public endpoint — returns the list of enabled payment methods.
 * The checkout page reads this to decide which payment options to show.
 */
export async function GET() {
  try {
    const config = await getPaymentConfig();
    const enabled = PAYMENT_METHODS_META.filter((m) => {
      // COD has `alwaysShow: true` — always return it (even if disabled, it's the fallback)
      if (m.alwaysShow) return true;
      return config[m.enabledKey];
    }).map((m) => ({
      id: m.id,
      name: m.name,
      nameBn: m.nameBn,
      desc: m.desc,
      descBn: m.descBn,
      icon: m.icon,
      recommended: m.recommended || false,
      alwaysShow: m.alwaysShow || false,
      // The actual enabled flag (useful for admin display)
      enabled: m.alwaysShow ? true : config[m.enabledKey],
    }));

    return NextResponse.json({
      success: true,
      methods: enabled,
      config,
    });
  } catch (e: any) {
    console.error("Payment methods API error:", e);
    return NextResponse.json(
      {
        success: true,
        methods: [
          {
            id: "cod",
            name: "Cash on Delivery",
            nameBn: "ক্যাশ অন ডেলিভারি",
            desc: "Pay with cash when you receive your order",
            descBn: "অর্ডার পেয়ে টাকা দিন",
            icon: "💵",
            recommended: true,
            alwaysShow: true,
            enabled: true,
          },
        ],
        config: null,
      },
      { status: 200 }
    );
  }
}
