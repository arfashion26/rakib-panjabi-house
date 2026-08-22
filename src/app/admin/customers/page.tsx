"use client";

import * as React from "react";
import { Search, Mail, Phone, ShoppingBag, Eye, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminUserManager } from "@/components/admin/user-manager";

interface Customer {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  status: string;
  created_at: string;
}

// Sample data shown when DB is not yet set up
const sampleCustomers: Customer[] = [
  { id: "1", email: "tanvir@example.com", name: "Tanvir Ahmed", phone: "+880 1711-123456", role: "CUSTOMER", status: "ACTIVE", created_at: "2026-01-15" },
  { id: "2", email: "rakibul@example.com", name: "Rakibul Hasan", phone: "+880 1712-234567", role: "CUSTOMER", status: "ACTIVE", created_at: "2026-02-20" },
  { id: "3", email: "imran@example.com", name: "Imran Khan", phone: "+880 1713-345678", role: "CUSTOMER", status: "ACTIVE", created_at: "2025-12-10" },
  { id: "4", email: "sadia@example.com", name: "Sadia Islam", phone: "+880 1714-456789", role: "CUSTOMER", status: "ACTIVE", created_at: "2026-03-05" },
  { id: "5", email: "mahmud@example.com", name: "Mahmud Hasan", phone: "+880 1715-567890", role: "CUSTOMER", status: "INACTIVE", created_at: "2026-02-18" },
  { id: "6", email: "nusrat@example.com", name: "Nusrat Jahan", phone: "+880 1716-678901", role: "CUSTOMER", status: "ACTIVE", created_at: "2026-01-22" },
];

// Sample order counts (in production, fetched from DB)
const sampleOrderStats: Record<string, { orders: number; spent: number }> = {
  "1": { orders: 12, spent: 28540 },
  "2": { orders: 8, spent: 19980 },
  "3": { orders: 15, spent: 42300 },
  "4": { orders: 3, spent: 5397 },
  "5": { orders: 6, spent: 14494 },
  "6": { orders: 10, spent: 21990 },
};

export default function AdminCustomersPage() {
  const [search, setSearch] = React.useState("");
  const [allUsers, setAllUsers] = React.useState<Customer[]>(sampleCustomers);

  const filtered = allUsers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-red-100 text-red-700",
    ADMIN: "bg-purple-100 text-purple-700",
    MANAGER: "bg-blue-100 text-blue-700",
    STAFF: "bg-green-100 text-green-700",
    CUSTOMER: "bg-muted text-muted-foreground",
  };

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

      <Tabs defaultValue="admins">
        <TabsList className="mb-6">
          <TabsTrigger value="admins">
            <Shield className="mr-2 h-4 w-4" />
            Admin & Staff
          </TabsTrigger>
          <TabsTrigger value="customers">
            <Users className="mr-2 h-4 w-4" />
            Customers ({filtered.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins">
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <AdminUserManager users={allUsers} />
          </div>
        </TabsContent>

        <TabsContent value="customers">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Customers table */}
          <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                    <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Orders</th>
                    <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Spent</th>
                    <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                    <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filtered.map((customer) => {
                    const stats = sampleOrderStats[customer.id] || { orders: 0, spent: 0 };
                    return (
                      <tr key={customer.id} className="hover:bg-muted/20">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                              {customer.name?.split(" ").map((n) => n[0]).join("") || "?"}
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
                            {stats.orders}
                          </span>
                        </td>
                        <td className="p-3 text-right text-sm font-medium">
                          {formatPrice(stats.spent)}
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="secondary" className={roleColors[customer.role] || roleColors.CUSTOMER}>
                            {customer.role.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="secondary" className={customer.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}>
                            {customer.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
