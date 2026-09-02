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
import { useLanguage } from "@/i18n/language-context";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [profile, setProfile] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  function saveProfile() {
    toast.success(t("dashboard.profileUpdatedSuccess"));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          {t("dashboard.settings")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("dashboard.manageSettingsDesc")}
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-accent-text" />
            <h2 className="font-serif text-lg font-medium">{t("dashboard.profileInfo")}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("dashboard.firstName")}</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("dashboard.lastName")}</Label>
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
            {t("dashboard.saveChanges")}
          </Button>
        </div>

        {/* Preferences */}
        <div className="rounded-lg border border-border/60 bg-background p-6">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-accent-text" />
            <h2 className="font-serif text-lg font-medium">{t("dashboard.preferences")}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lang">{t("dashboard.language")}</Label>
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
              <Label htmlFor="currency">{t("dashboard.currency")}</Label>
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
            <Bell className="h-5 w-5 text-accent-text" />
            <h2 className="font-serif text-lg font-medium">
              {t("dashboard.notifications")}
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { label: t("dashboard.orderUpdates"), desc: t("dashboard.orderUpdatesDesc"), checked: true },
              { label: t("dashboard.promotions"), desc: t("dashboard.promotionsDesc"), checked: true },
              { label: t("dashboard.wishlistAlerts"), desc: t("dashboard.wishlistAlertsDesc"), checked: false },
              { label: t("dashboard.newsletter"), desc: t("dashboard.newsletterDesc"), checked: true },
              { label: t("dashboard.smsNotifications"), desc: t("dashboard.smsNotificationsDesc"), checked: false },
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
            <Shield className="h-5 w-5 text-accent-text" />
            <h2 className="font-serif text-lg font-medium">{t("dashboard.security")}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current">{t("dashboard.currentPassword")}</Label>
              <Input id="current" type="password" placeholder="••••••••" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="new">{t("dashboard.newPassword")}</Label>
                <Input id="new" type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label htmlFor="confirm">{t("dashboard.confirmPassword")}</Label>
                <Input id="confirm" type="password" placeholder="••••••••" />
              </div>
            </div>
            <Button variant="outline">{t("dashboard.updatePassword")}</Button>
          </div>

          <Separator className="my-6" />

          {/* Danger zone */}
          <div>
            <h3 className="text-sm font-medium text-red-500">{t("dashboard.dangerZone")}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("dashboard.dangerZoneDesc")}
            </p>
            <Button variant="outline" className="mt-3 border-red-500/50 text-red-500 hover:bg-red-500/10">
              {t("dashboard.deleteAccount")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
