"use client";

import * as React from "react";
import { CreditCard, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentConfig {
  cod_enabled: boolean;
  bkash_enabled: boolean;
  nagad_enabled: boolean;
  rocket_enabled: boolean;
  sslcommerz_enabled: boolean;
  stripe_enabled: boolean;
}

const METHOD_INFO: { key: keyof PaymentConfig; name: string; desc: string; icon: string }[] = [
  { key: "cod_enabled", name: "Cash on Delivery", desc: "Pay when you receive — most popular in Bangladesh", icon: "💵" },
  { key: "bkash_enabled", name: "bKash", desc: "Mobile payment via bKash", icon: "📱" },
  { key: "nagad_enabled", name: "Nagad", desc: "Mobile payment via Nagad", icon: "📱" },
  { key: "rocket_enabled", name: "Rocket", desc: "Mobile payment via Rocket", icon: "📱" },
  { key: "sslcommerz_enabled", name: "SSLCommerz", desc: "Visa, Mastercard, Amex, bKash, Nagad via SSLCommerz", icon: "💳" },
  { key: "stripe_enabled", name: "Stripe", desc: "International cards (Visa, Mastercard) for global customers", icon: "🌍" },
];

export function PaymentMethodsConfig() {
  const [config, setConfig] = React.useState<PaymentConfig | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/admin/payment-config")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setConfig(data.config);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function toggle(key: keyof PaymentConfig, value: boolean) {
    if (!config) return;
    setConfig({ ...config, [key]: value });
  }

  async function save() {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/payment-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Payment methods updated successfully");
        setConfig(data.config);
      } else {
        toast.error(data.error || "Failed to update payment methods");
      }
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-border/60 bg-background p-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading payment configuration...</span>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="rounded-lg border border-border/60 bg-background p-6">
        <p className="text-sm text-muted-foreground">
          Could not load payment configuration. Please ensure the database is connected.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/60 bg-background p-6">
      <div className="mb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-accent-text" />
        <h2 className="font-serif text-lg font-medium">Payment Methods</h2>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Enable or disable payment methods shown at checkout. At least one method must be enabled.
      </p>
      <div className="space-y-3">
        {METHOD_INFO.map((method) => {
          const enabled = config[method.key];
          const isCod = method.key === "cod_enabled";
          return (
            <label
              key={method.key}
              className={`flex items-center justify-between rounded-md border p-3 transition-colors ${
                enabled ? "border-accent/40 bg-accent/5" : "border-border/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <p className="text-sm font-medium">
                    {method.name}
                    {isCod && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                        Always available
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{method.desc}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle(method.key, !enabled)}
                disabled={isCod && enabled && !Object.entries(config).some(([k, v]) => k !== "cod_enabled" && v)}
                className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  enabled ? "bg-accent" : "bg-muted"
                }`}
                aria-label={`Toggle ${method.name}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    enabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
          );
        })}
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={save} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
