"use client";

import * as React from "react";
import { Save, Store, Truck, Mail, Loader2, Image as ImageIcon, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/admin/image-upload";
import { PaymentMethodsConfig } from "@/components/admin/payment-methods-config";
import { CustomCodeEditor } from "@/components/admin/custom-code-editor";
import { ChangePasswordSection } from "@/components/admin/change-password-section";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  // Form state — controlled inputs
  const [form, setForm] = React.useState({
    site_name: "Rakib Panjabi House",
    tagline: "Premium Panjabi & Fashion for the Modern Gentleman",
    site_description: "Premium quality Panjabis, shirts, pants, and ethnic wear with timeless elegance and modern designs.",
    logo_url: "",
    favicon_url: "",
    contact_email: "info@alrakib.com",
    contact_phone: "+880 1716-243949",
    whatsapp_number: "+880 1716-243949",
    address: "Shop no- 78, Mukjoddha Super Market, 3rd Floor, Mirpur-1, Dhaka-1216",
    facebook_url: "https://www.facebook.com/Alrakibfashionhouse/",
    instagram_url: "https://www.instagram.com/alrakibpunjabihouse/",
    youtube_url: "https://www.youtube.com/@Al-RakibFashionHouse",
    twitter_url: "",
    free_shipping_threshold: "2000",
    cod_inside_dhaka: "70",
    cod_outside_dhaka: "120",
    // Currency conversion: 1 USD = how many BDT
    // Used by the currency toggle on the site header to convert prices.
    // Example: if rate is 110, a ৳1100 product shows as $10.00.
    usd_rate: "110",
  });

  // Load settings from DB
  React.useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) {
          setForm((prev) => ({ ...prev, ...data.settings }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Settings saved successfully");
      } else {
        toast.error(data.error || "Failed to save settings");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Settings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your store configuration
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* Brand Assets — Logo + Favicon */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-accent-text" />
            <h2 className="font-serif text-lg font-medium">Brand Assets</h2>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Upload your store logo and favicon. Logo appears in the header, footer,
            and emails. Favicon appears in browser tabs. If left empty, defaults to
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-[10px]">/logo.jpg</code>
            and
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-[10px]">/favicon.ico</code>.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUpload
              label="Store Logo"
              value={form.logo_url || ""}
              onChange={(url) => update("logo_url", url)}
              folder="brand"
              aspectRatio="aspect-square"
              hint="Recommended: 400×400px (square). Used in header, footer, emails."
            />
            <ImageUpload
              label="Favicon"
              value={form.favicon_url || ""}
              onChange={(url) => update("favicon_url", url)}
              folder="brand"
              aspectRatio="aspect-square"
              hint="Recommended: 32×32px or 64×64px (square, PNG/ICO). Shown in browser tab."
            />
          </div>
        </div>

        {/* General */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <Store className="h-5 w-5 text-accent-text" />
            <h2 className="font-serif text-lg font-medium">General</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={form.site_name}
                onChange={(e) => update("site_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={form.tagline}
                onChange={(e) => update("tagline", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Site Description (SEO)</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.site_description}
                onChange={(e) => update("site_description", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-accent-text" />
            <h2 className="font-serif text-lg font-medium">Contact Information</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Support Email</Label>
              <Input
                id="email"
                type="email"
                value={form.contact_email}
                onChange={(e) => update("contact_email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Support Phone</Label>
              <Input
                id="phone"
                value={form.contact_phone}
                onChange={(e) => update("contact_phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={form.whatsapp_number}
                onChange={(e) => update("whatsapp_number", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-accent-text" />
            <h2 className="font-serif text-lg font-medium">Shipping</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="freeShip">Free Shipping Threshold (৳)</Label>
              <Input
                id="freeShip"
                type="number"
                value={form.free_shipping_threshold}
                onChange={(e) => update("free_shipping_threshold", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flatShip">COD Charge (Inside Dhaka)</Label>
              <Input
                id="flatShip"
                type="number"
                value={form.cod_inside_dhaka}
                onChange={(e) => update("cod_inside_dhaka", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outsideShip">COD Charge (Outside Dhaka)</Label>
              <Input
                id="outsideShip"
                type="number"
                value={form.cod_outside_dhaka}
                onChange={(e) => update("cod_outside_dhaka", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Currency Conversion — USD rate for header currency toggle */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent-text" />
            <h2 className="font-serif text-lg font-medium">Currency Conversion</h2>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Set the exchange rate for converting BDT prices to USD. When a customer
            toggles the currency switch in the site header, product prices are
            converted using this rate. Only affects display — orders are still
            processed in BDT.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="usdRate">USD Exchange Rate (1 USD = ? ৳)</Label>
              <Input
                id="usdRate"
                type="number"
                step="0.01"
                min="1"
                value={form.usd_rate}
                onChange={(e) => update("usd_rate", e.target.value)}
                placeholder="e.g. 110"
              />
              <p className="text-[10px] text-muted-foreground">
                Current: 1 USD = ৳{form.usd_rate || "110"}. A ৳1100 product will
                show as ${(1100 / Number(form.usd_rate || 110)).toFixed(2)} when
                user switches to USD.
              </p>
            </div>
            <div className="flex items-end">
              <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">How it works</p>
                <ul className="mt-1 list-disc space-y-1 pl-4">
                  <li>Default currency: BDT (৳)</li>
                  <li>Customer can switch to USD ($) in the header</li>
                  <li>Prices convert using the rate above</li>
                  <li>Cart, checkout, orders still use BDT</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods — real API-backed config */}
        <PaymentMethodsConfig />

        {/* Social Media */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <h2 className="mb-4 font-serif text-lg font-medium">Social Media</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fb">Facebook URL</Label>
              <Input
                id="fb"
                value={form.facebook_url}
                onChange={(e) => update("facebook_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ig">Instagram URL</Label>
              <Input
                id="ig"
                value={form.instagram_url}
                onChange={(e) => update("instagram_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yt">YouTube URL</Label>
              <Input
                id="yt"
                value={form.youtube_url}
                onChange={(e) => update("youtube_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tw">Twitter/X URL</Label>
              <Input
                id="tw"
                value={form.twitter_url}
                onChange={(e) => update("twitter_url", e.target.value)}
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>

        {/* Save button at bottom */}
        <div className="flex justify-end pb-4">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save All Changes
          </Button>
        </div>

        <Separator />

        {/* Custom Tracking Code */}
        <CustomCodeEditor />

        {/* Change Password */}
        <ChangePasswordSection />
      </div>
    </div>
  );
}
