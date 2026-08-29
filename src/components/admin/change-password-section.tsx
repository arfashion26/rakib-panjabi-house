"use client";

import * as React from "react";
import { Key, Loader2, Check, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ChangePasswordSection() {
  const [form, setForm] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Password strength indicator
  const strength = React.useMemo(() => {
    const pwd = form.newPassword;
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { score, label: "Medium", color: "bg-yellow-500" };
    return { score, label: "Strong", color: "bg-green-500" };
  }, [form.newPassword]);

  const passwordsMatch =
    form.confirmPassword === "" || form.newPassword === form.confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Password changed successfully");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch {
      toast.error("Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border/60 bg-background p-6">
      <div className="mb-4 flex items-start gap-2">
        <Key className="mt-0.5 h-5 w-5 text-accent" />
        <div>
          <h2 className="font-serif text-lg font-medium">Change Password</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Update your admin account password. The change takes effect immediately
            and applies to all future logins.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password *</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              value={form.currentPassword}
              onChange={(e) => update("currentPassword", e.target.value)}
              placeholder="Enter your current password"
              className="pr-10"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showCurrent ? "Hide password" : "Show password"}
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password *</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNew ? "text" : "password"}
              value={form.newPassword}
              onChange={(e) => update("newPassword", e.target.value)}
              placeholder="At least 8 characters"
              className="pr-10"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {/* Strength indicator */}
          {form.newPassword && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full transition-all", strength.color)}
                  style={{ width: `${(strength.score / 6) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">
                {strength.label}
              </span>
            </div>
          )}
          <p className="text-[10px] text-muted-foreground">
            Use 8+ characters with uppercase, lowercase, numbers, and symbols for a strong password.
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              placeholder="Re-enter new password"
              className={cn(
                "pr-10",
                !passwordsMatch && "border-red-500 focus-visible:ring-red-500/30"
              )}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {!passwordsMatch && (
            <p className="text-[10px] text-red-500">Passwords do not match</p>
          )}
        </div>
      </div>

      {/* Security note */}
      <div className="mt-4 flex items-start gap-2 rounded-md bg-muted/50 p-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
        <p className="text-xs text-muted-foreground">
          After changing your password, you&apos;ll stay logged in on this device.
          On other devices, you&apos;ll need to log in again with the new password.
        </p>
      </div>

      {/* Submit */}
      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={saving || !passwordsMatch}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Changing...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Change Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
