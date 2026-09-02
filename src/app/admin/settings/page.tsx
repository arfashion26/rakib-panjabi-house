"use client";

import * as React from "react";
import { Save, Store, Truck, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
