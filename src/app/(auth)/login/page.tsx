"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithPhone } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Loader2, ArrowRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useLanguage } from "@/i18n/language-context";
function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [phone, setPhone] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    try {
      const result = await signInWithPhone(phone);
      if (result.success) {
        const target = result.redirectTo || redirectTo;
        if (result.role && ["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"].includes(result.role)) {
          toast.success("Welcome back, Admin!");
        } else {
          toast.success("Login successful! Welcome back.");
        }
        router.push(target);
        router.refresh();
      } else {
        toast.error(result.error || "Login failed.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl border border-border/60 bg-background p-6 shadow-sm md:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Login to Your Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your phone number to access your orders and account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">{t("login.phoneNumber")}</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder={t("login.phonePlaceholder")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
                required
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Use the phone number you provided when placing your order.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading || !phone.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Help text */}
        <div className="mt-6 rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">No account yet?</p>
          <p className="mt-1">
            Your account is automatically created when you place your first order.
            Just shop, checkout, and your account will be ready!
          </p>
          <Button asChild variant="outline" size="sm" className="mt-3 w-full">
            <Link href="/shop">
              <ShoppingBag className="mr-2 h-3.5 w-3.5" />
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>

      {/* Admin login link */}
      <div className="mt-4 text-center">
        <Link
          href="/admin/login"
          className="text-xs text-muted-foreground hover:text-accent"
        >
          Admin Login →
        </Link>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        By logging in, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-accent">Terms</Link> and{" "}
        <Link href="/privacy-policy" className="underline hover:text-accent">Privacy Policy</Link>.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="w-full max-w-md" style={{ height: 400 }} />}>
      <LoginForm />
    </React.Suspense>
  );
}
