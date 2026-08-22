"use client";

import * as React from "react";
import { User, Mail, Phone, Globe, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function SettingsPage() {
  const [profile, setProfile] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  function saveProfile() {
    toast.success("Profile updated successfully");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Account Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your profile, preferences, and security
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-lg font-medium">Profile Information</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  className="pl-10"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <Button className="mt-4" onClick={saveProfile}>
            Save Changes
          </Button>
        </div>

        {/* Preferences */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-lg font-medium">Preferences</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lang">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="lang">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="BDT">
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BDT">৳ BDT (Bangladeshi Taka)</SelectItem>
                  <SelectItem value="USD">$ USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR">€ EUR (Euro)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-lg font-medium">
              Notification Preferences
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Order updates", desc: "Order status, shipping, delivery", checked: true },
              { label: "Promotions & offers", desc: "Sales, discount codes, new arrivals", checked: true },
              { label: "Wishlist alerts", desc: "When wishlist items go on sale or back in stock", checked: false },
              { label: "Newsletter", desc: "Monthly style inspiration and tips", checked: true },
              { label: "SMS notifications", desc: "Order updates via SMS (BD only)", checked: false },
            ].map((pref, i) => (
              <label
                key={i}
                className="flex items-center justify-between rounded-md border border-border/60 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{pref.label}</p>
                  <p className="text-xs text-muted-foreground">{pref.desc}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={pref.checked}
                  className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-muted transition-colors checked:bg-accent before:block before:h-4 before:w-4 before:translate-x-0.5 before:translate-y-0.5 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-lg font-medium">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current">Current Password</Label>
              <Input id="current" type="password" placeholder="••••••••" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input id="confirm" type="password" placeholder="••••••••" />
              </div>
            </div>
            <Button variant="outline">Update Password</Button>
          </div>

          <Separator className="my-6" />

          {/* Danger zone */}
          <div>
            <h3 className="text-sm font-medium text-red-500">Danger Zone</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="outline" className="mt-3 border-red-500/50 text-red-500 hover:bg-red-500/10">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
