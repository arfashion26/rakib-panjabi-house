"use client";

import { Search, Mail, Phone, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/types";

const customers = [
  { id: "1", name: "Tanvir Ahmed", email: "tanvir@example.com", phone: "+880 1711-123456", orders: 12, spent: 28540, joined: "Jan 2026", status: "ACTIVE" },
  { id: "2", name: "Rakibul Hasan", email: "rakibul@example.com", phone: "+880 1712-234567", orders: 8, spent: 19980, joined: "Feb 2026", status: "ACTIVE" },
  { id: "3", name: "Imran Khan", email: "imran@example.com", phone: "+880 1713-345678", orders: 15, spent: 42300, joined: "Dec 2025", status: "ACTIVE" },
  { id: "4", name: "Sadia Islam", email: "sadia@example.com", phone: "+880 1714-456789", orders: 3, spent: 5397, joined: "Mar 2026", status: "ACTIVE" },
  { id: "5", name: "Mahmud Hasan", email: "mahmud@example.com", phone: "+880 1715-567890", orders: 6, spent: 14494, joined: "Feb 2026", status: "INACTIVE" },
  { id: "6", name: "Nusrat Jahan", email: "nusrat@example.com", phone: "+880 1716-678901", orders: 10, spent: 21990, joined: "Jan 2026", status: "ACTIVE" },
];

export default function AdminCustomersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Customers
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {customers.length} registered customers
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-10" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Orders</th>
                <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Spent</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
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
                        {customer.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <p className="text-sm font-medium">{customer.name}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {customer.phone}
                    </p>
                  </td>
                  <td className="p-3 text-center text-sm">
                    <span className="inline-flex items-center gap-1">
                      <ShoppingBag className="h-3 w-3" />
                      {customer.orders}
                    </span>
                  </td>
                  <td className="p-3 text-right text-sm font-medium">
                    {formatPrice(customer.spent)}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{customer.joined}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
