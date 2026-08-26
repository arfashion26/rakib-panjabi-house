"use client";

import * as React from "react";
import { Save, Store, CreditCard, Truck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  function save() {
    toast.success("Settings saved");
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
        <Button onClick={save}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* General */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <Store className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-lg font-medium">General</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="Rakib Panjabi House" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" defaultValue="Premium Panjabi & Fashion for the Modern Gentleman" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Site Description (SEO)</Label>
              <Textarea id="description" rows={3} defaultValue="Premium quality Panjabis, shirts, pants, and ethnic wear with timeless elegance and modern designs." />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-lg font-medium">Contact Information</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Support Email</Label>
              <Input id="email" type="email" defaultValue="info@alrakib.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Support Phone</Label>
              <Input id="phone" defaultValue="+880 1716-243949" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" defaultValue="+880 1716-243949" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="Shop no- 78, Mukjoddha Super Market, 3rd Floor, Mirpur-1, Dhaka-1216" />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-lg font-medium">Shipping</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="freeShip">Free Shipping Threshold (৳)</Label>
              <Input id="freeShip" type="number" defaultValue="2000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flatShip">Flat Rate (Dhaka)</Label>
              <Input id="flatShip" type="number" defaultValue="80" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="outsideShip">Outside Dhaka</Label>
              <Input id="outsideShip" type="number" defaultValue="130" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cod">COD Charge</Label>
              <Input id="cod" type="number" defaultValue="50" />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-lg font-medium">Payment Methods</h2>
          </div>
          <div className="space-y-3">
            {[
              { name: "SSLCommerz", desc: "bKash, Nagad, Rocket, Cards", enabled: true },
              { name: "Stripe", desc: "International cards (Visa, Mastercard)", enabled: true },
              { name: "Cash on Delivery", desc: "Pay when you receive", enabled: true },
            ].map((method, i) => (
              <label
                key={i}
                className="flex items-center justify-between rounded-md border border-border/60 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{method.name}</p>
                  <p className="text-xs text-muted-foreground">{method.desc}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={method.enabled}
                  className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-muted transition-colors checked:bg-accent before:block before:h-4 before:w-4 before:translate-x-0.5 before:translate-y-0.5 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Social */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <h2 className="mb-4 font-serif text-lg font-medium">Social Media</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fb">Facebook URL</Label>
              <Input id="fb" defaultValue="https://www.facebook.com/Alrakibfashionhouse/" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ig">Instagram URL</Label>
              <Input id="ig" defaultValue="https://www.instagram.com/alrakibpunjabihouse/" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yt">YouTube URL</Label>
              <Input id="yt" defaultValue="https://www.youtube.com/@Al-RakibFashionHouse" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tw">Twitter/X URL</Label>
              <Input id="tw" placeholder="https://twitter.com/..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
