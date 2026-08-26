/**
 * Payment method configuration — constants only.
 *
 * This file has NO "use server" directive, so it can be imported by both
 * server and client code, and it can export objects/constants.
 *
 * The actual database read/write functions live in `settings.ts`.
 */

export const DEFAULT_PAYMENT_CONFIG = {
  cod_enabled: true,
  bkash_enabled: false,
  nagad_enabled: false,
  rocket_enabled: false,
  sslcommerz_enabled: false,
  stripe_enabled: false,
};

export type PaymentConfig = typeof DEFAULT_PAYMENT_CONFIG;

/**
 * Payment method display metadata. The `id` matches the value
 * stored in the order's `payment_method` column.
 */
export const PAYMENT_METHODS_META = [
  {
    id: "cod",
    name: "Cash on Delivery",
    nameBn: "ক্যাশ অন ডেলিভারি",
    desc: "Pay with cash when you receive your order",
    descBn: "অর্ডার পেয়ে টাকা দিন",
    icon: "💵",
    enabledKey: "cod_enabled" as const,
    alwaysShow: true,
    recommended: true,
  },
  {
    id: "bkash",
    name: "bKash",
    nameBn: "বিকাশ",
    desc: "Pay with your bKash account",
    descBn: "আপনার বিকাশ অ্যাকাউন্ট দিয়ে পেমেন্ট করুন",
    icon: "📱",
    enabledKey: "bkash_enabled" as const,
  },
  {
    id: "nagad",
    name: "Nagad",
    nameBn: "নগদ",
    desc: "Pay with your Nagad account",
    descBn: "আপনার নগদ অ্যাকাউন্ট দিয়ে পেমেন্ট করুন",
    icon: "📱",
    enabledKey: "nagad_enabled" as const,
  },
  {
    id: "rocket",
    name: "Rocket",
    nameBn: "রকেট",
    desc: "Pay with your Rocket account",
    descBn: "আপনার রকেট অ্যাকাউন্ট দিয়ে পেমেন্ট করুন",
    icon: "📱",
    enabledKey: "rocket_enabled" as const,
  },
  {
    id: "sslcommerz",
    name: "Card Payment (SSLCommerz)",
    nameBn: "কার্ড পেমেন্ট (SSLCommerz)",
    desc: "Visa, Mastercard, Amex",
    descBn: "ভিসা, মাস্টারকার্ড, অ্যামেক্স",
    icon: "💳",
    enabledKey: "sslcommerz_enabled" as const,
  },
  {
    id: "stripe",
    name: "International Card (Stripe)",
    nameBn: "আন্তর্জাতিক কার্ড (Stripe)",
    desc: "For international customers",
    descBn: "আন্তর্জাতিক গ্রাহকদের জন্য",
    icon: "🌍",
    enabledKey: "stripe_enabled" as const,
  },
];
