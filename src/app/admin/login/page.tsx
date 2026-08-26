"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail } from "@/lib/auth-actions";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      const result = await signInWithEmail({ email, password });
      if (result.success) {
        if (result.role && ["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"].includes(result.role)) {
          toast.success("Welcome back, Admin!");
          router.push("/admin");
          router.refresh();
        } else {
          toast.error("This account doesn't have admin privileges.");
        }
      } else {
        toast.error(result.error || "Login failed. Please check your credentials.");
      }
    } catch (e: any) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo variant="light" size="lg" />
        </div>

        <div className="rounded-xl border border-primary-foreground/10 bg-background p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <ShieldCheck className="h-7 w-7 text-accent" />
            </div>
            <h1 className="font-serif text-2xl font-medium tracking-tight">
              Admin Login
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@rakibpanjabihouse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Sign In to Admin Panel
                </>
              )}
            </Button>
          </form>

          {/* Back to site */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-xs text-muted-foreground hover:text-accent"
            >
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
