"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const result = await resetPassword(email);
      if (result.success) {
        setSent(true);
        toast.success("Password reset link sent to your email.");
      } else {
        toast.error(result.error || "Failed to send reset email.");
      }
    } catch (e: any) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-border/60 bg-background p-6 text-center shadow-sm md:p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <CheckCircle2 className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-serif text-2xl font-medium">Check Your Email</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We&apos;ve sent a password reset link to <strong className="text-foreground">{email}</strong>.
            The link will expire in 1 hour.
          </p>
          <Button
            className="mt-6 w-full"
            variant="outline"
            onClick={() => router.push("/login")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl border border-border/60 bg-background p-6 shadow-sm md:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                autoFocus
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="inline-flex items-center text-accent hover:underline">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
