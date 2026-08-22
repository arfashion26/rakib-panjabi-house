"use client";

import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/types";

const coupons = [
  { id: "1", code: "WELCOME10", type: "PERCENTAGE", value: 10, used: 245, limit: 1000, status: "ACTIVE", expires: "Dec 31, 2026" },
  { id: "2", code: "RAKIB20", type: "PERCENTAGE", value: 20, used: 89, limit: 500, status: "ACTIVE", expires: "Sep 30, 2026" },
  { id: "3", code: "FESTIVE15", type: "PERCENTAGE", value: 15, used: 412, limit: 1000, status: "ACTIVE", expires: "Oct 15, 2026" },
  { id: "4", code: "FLAT500", type: "FIXED_AMOUNT", value: 500, used: 67, limit: 200, status: "ACTIVE", expires: "Nov 30, 2026" },
  { id: "5", code: "SUMMER22", type: "PERCENTAGE", value: 22, used: 1000, limit: 1000, status: "EXPIRED", expires: "Aug 31, 2026" },
];

export default function AdminCouponsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Coupons
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {coupons.length} coupons ({coupons.filter((c) => c.status === "ACTIVE").length} active)
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="relative rounded-lg border border-border/60 bg-background p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-accent" />
                  <span className="font-mono text-lg font-bold">{coupon.code}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {coupon.type === "PERCENTAGE"
                    ? `${coupon.value}% off`
                    : `${formatPrice(coupon.value)} off`}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={coupon.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}
              >
                {coupon.status}
              </Badge>
            </div>

            <div className="mt-4 space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Used</span>
                <span className="font-medium text-foreground">
                  {coupon.used} / {coupon.limit}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Expires</span>
                <span className="text-foreground">{coupon.expires}</span>
              </div>
            </div>

            {/* Usage progress */}
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${Math.min(100, (coupon.used / coupon.limit) * 100)}%` }}
              />
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
