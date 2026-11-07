"use client";

import * as React from "react";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminUserManager } from "@/components/admin/user-manager";

export default function AdminUsersPage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
          <Link href="/admin">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-accent-text" />
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Users &amp; Roles
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Create staff members or admins with limited or full access. Manage their
          roles, change passwords, or remove admin access.
        </p>
      </div>

      {/* Quick access cards */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border/60 bg-background p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-text">
            Admin
          </div>
          <p className="text-sm font-medium">Full Access</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Everything: products, orders, customers, settings, AND user creation.
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
            Manager
          </div>
          <p className="text-sm font-medium">Limited Access</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Products, categories, orders, blog. No settings or user management.
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-600">
            Staff
          </div>
          <p className="text-sm font-medium">Orders Only</p>
          <p className="mt-1 text-xs text-muted-foreground">
            View and manage orders. No access to products, settings, or users.
          </p>
        </div>
      </div>

      <AdminUserManager />
    </div>
  );
}
