"use client";

import * as React from "react";
import { Search, Mail, Phone, ShoppingBag, Eye, Users, Shield, Loader2, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminUserManager } from "@/components/admin/user-manager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Customer {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  status: string;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

export default function AdminCustomersPage() {
  const [allUsers, setAllUsers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<Customer | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data.success) {
        setAllUsers(data.users || []);
      }
    } catch {
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/customers/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Customer deleted");
        setDeleteTarget(null);
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to delete customer");
      }
    } catch {
      toast.error("Failed to delete customer");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = allUsers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  const customers = filtered.filter((u) => u.role === "CUSTOMER");

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-red-100 text-red-700",
    ADMIN: "bg-purple-100 text-purple-700",
    MANAGER: "bg-blue-100 text-blue-700",
    STAFF: "bg-green-100 text-green-700",
    CUSTOMER: "bg-muted text-muted-foreground",
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Users & Customers
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage admin/staff members and view customer list
        </p>
      </div>

      <Tabs defaultValue="customers">
        <TabsList className="mb-6">
          <TabsTrigger value="customers">
            <Users className="mr-2 h-4 w-4" />
            Customers ({customers.length})
          </TabsTrigger>
          <TabsTrigger value="admins">
            <Shield className="mr-2 h-4 w-4" />
            Admin & Staff
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Customers table */}
          {customers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <Users className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium">
                {search ? "No customers match your search" : "No customers yet"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {search
                  ? "Try a different search term"
                  : "Customers will appear here when they place orders"}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="border-b border-border bg-muted/30">
                    <tr>
                      <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                      <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                      <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Orders</th>
                      <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Spent</th>
                      <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-muted/20">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                              {customer.name?.split(" ").map((n) => n[0]).join("") || customer.email[0].toUpperCase()}
                            </div>
                            <p className="text-sm font-medium">{customer.name || "Unnamed"}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {customer.phone || "—"}
                          </p>
                        </td>
                        <td className="p-3 text-center text-sm">
                          <span className="inline-flex items-center gap-1">
                            <ShoppingBag className="h-3 w-3" />
                            {customer.order_count || 0}
                          </span>
                        </td>
                        <td className="p-3 text-right text-sm font-medium">
                          {formatPrice(customer.total_spent || 0)}
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="secondary" className={customer.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}>
                            {customer.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="View details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-red-500"
                              title="Delete customer"
                              onClick={() => setDeleteTarget(customer)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="admins">
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <AdminUserManager users={allUsers} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
              Delete Customer
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteTarget && (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  {deleteTarget.name?.split(" ").map((n) => n[0]).join("") || deleteTarget.email[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{deleteTarget.name || "Unnamed"}</p>
                  <p className="truncate text-xs text-muted-foreground">{deleteTarget.email}</p>
                  {deleteTarget.phone && (
                    <p className="text-xs text-muted-foreground">{deleteTarget.phone}</p>
                  )}
                </div>
              </div>
              {deleteTarget.order_count && deleteTarget.order_count > 0 ? (
                <div className="mt-3 rounded-md bg-yellow-50 p-2 text-xs text-yellow-800">
                  This customer has {deleteTarget.order_count} order(s). Their orders
                  will be preserved for record-keeping, but their account will be
                  permanently deleted.
                </div>
              ) : (
                <div className="mt-3 rounded-md bg-green-50 p-2 text-xs text-green-800">
                  This customer has no orders. Safe to delete.
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Permanently
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
