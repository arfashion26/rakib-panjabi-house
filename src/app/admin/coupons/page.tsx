"use client";

import * as React from "react";
import { Plus, Trash2, Tag, Loader2, X, Copy, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  min_order: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  per_user_limit: number;
  used_count: number;
  starts_at: string;
  expires_at: string | null;
  is_active: boolean;
  first_time_only: boolean;
  created_at: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreate, setShowCreate] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Coupon | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  async function fetchCoupons() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
      } else {
        toast.error(data.error || "Failed to load coupons");
      }
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchCoupons();
  }, []);

  async function toggleActive(coupon: Coupon) {
    const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !coupon.is_active }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(`Coupon ${coupon.is_active ? "deactivated" : "activated"}`);
      fetchCoupons();
    } else {
      toast.error(data.error || "Failed to update coupon");
    }
  }

  async function deleteCoupon(coupon: Coupon) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        if (data.deactivated) {
          toast.success(data.message);
        } else {
          toast.success("Coupon deleted");
        }
        setDeleteTarget(null);
        fetchCoupons();
      } else {
        toast.error(data.error || "Failed to delete coupon");
      }
    } catch {
      toast.error("Failed to delete coupon");
    } finally {
      setDeleting(false);
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  const activeCount = coupons.filter((c) => c.is_active).length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Coupons
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {coupons.length} coupons ({activeCount} active)
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading coupons...</span>
        </div>
      ) : coupons.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Tag className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">No coupons yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create your first coupon to offer discounts to customers.
          </p>
          <Button onClick={() => setShowCreate(true)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="relative rounded-lg border border-border/60 bg-background p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-accent-text" />
                    <button
                      onClick={() => copyCode(coupon.code)}
                      className="group flex items-center gap-1 font-mono text-lg font-bold"
                      title="Click to copy"
                    >
                      {coupon.code}
                      {copiedCode === coupon.code ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {coupon.type === "PERCENTAGE"
                      ? `${coupon.value}% off`
                      : coupon.type === "FIXED_AMOUNT"
                      ? `${formatPrice(coupon.value)} off`
                      : coupon.type === "FREE_SHIPPING"
                      ? "Free shipping"
                      : `${coupon.value} off`}
                  </p>
                  {coupon.description && (
                    <p className="mt-1 text-xs italic text-muted-foreground">
                      "{coupon.description}"
                    </p>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={
                    coupon.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {coupon.is_active ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>

              <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Used</span>
                  <span className="font-medium text-foreground">
                    {coupon.used_count}
                    {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Per user limit</span>
                  <span className="text-foreground">{coupon.per_user_limit}</span>
                </div>
                {coupon.min_order && (
                  <div className="flex justify-between">
                    <span>Min order</span>
                    <span className="text-foreground">{formatPrice(coupon.min_order)}</span>
                  </div>
                )}
                {coupon.max_discount && (
                  <div className="flex justify-between">
                    <span>Max discount</span>
                    <span className="text-foreground">{formatPrice(coupon.max_discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Expires</span>
                  <span className="text-foreground">
                    {coupon.expires_at
                      ? new Date(coupon.expires_at).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
              </div>

              {/* Usage progress */}
              {coupon.usage_limit && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{
                      width: `${Math.min(100, (coupon.used_count / coupon.usage_limit) * 100)}%`,
                    }}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleActive(coupon)}
                >
                  {coupon.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-red-500"
                  onClick={() => setDeleteTarget(coupon)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Coupon Dialog */}
      <CreateCouponDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={() => {
          setShowCreate(false);
          fetchCoupons();
        }}
      />

      {/* Delete confirmation */}
      {deleteTarget && (
        <Dialog open onOpenChange={() => setDeleteTarget(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
                Delete Coupon?
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <Tag className="h-5 w-5 text-accent-text" />
                <div>
                  <p className="font-mono text-sm font-bold">{deleteTarget.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {deleteTarget.type === "PERCENTAGE"
                      ? `${deleteTarget.value}% off`
                      : deleteTarget.type === "FIXED_AMOUNT"
                      ? `${formatPrice(deleteTarget.value)} off`
                      : "Free shipping"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {deleteTarget.used_count > 0
                  ? `This coupon has been used ${deleteTarget.used_count} time(s). It will be deactivated instead of being permanently removed, to preserve order history.`
                  : "This coupon has not been used yet and will be permanently deleted. This action cannot be undone."}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => deleteCoupon(deleteTarget)} disabled={deleting}>
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
      )}
    </div>
  );
}

function CreateCouponDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const [form, setForm] = React.useState({
    code: "",
    description: "",
    type: "PERCENTAGE",
    value: "10",
    min_order: "",
    max_discount: "",
    usage_limit: "100",
    per_user_limit: "1",
    expires_at: "",
    is_active: true,
    first_time_only: false,
  });
  const [saving, setSaving] = React.useState(false);

  async function handleCreate() {
    if (!form.code.trim() || !form.value) {
      toast.error("Code and value are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.trim().toUpperCase(),
          description: form.description.trim() || null,
          type: form.type,
          value: Number(form.value),
          min_order: form.min_order ? Number(form.min_order) : null,
          max_discount: form.max_discount ? Number(form.max_discount) : null,
          usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
          per_user_limit: Number(form.per_user_limit) || 1,
          expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
          is_active: form.is_active,
          first_time_only: form.first_time_only,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Coupon ${data.coupon.code} created!`);
        // Reset form
        setForm({
          code: "",
          description: "",
          type: "PERCENTAGE",
          value: "10",
          min_order: "",
          max_discount: "",
          usage_limit: "100",
          per_user_limit: "1",
          expires_at: "",
          is_active: true,
          first_time_only: false,
        });
        onCreated();
      } else {
        toast.error(data.error || "Failed to create coupon");
      }
    } catch {
      toast.error("Failed to create coupon");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Coupon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code *</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="WELCOME10"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="PERCENTAGE">Percentage (e.g. 10% off)</option>
                <option value="FIXED_AMOUNT">Fixed Amount (e.g. ৳500 off)</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="value">
                {form.type === "PERCENTAGE" ? "Discount (%)" : form.type === "FIXED_AMOUNT" ? "Discount (৳)" : "Value"}
              </Label>
              <Input
                id="value"
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="per_user_limit">Per User Limit</Label>
              <Input
                id="per_user_limit"
                type="number"
                value={form.per_user_limit}
                onChange={(e) => setForm({ ...form, per_user_limit: e.target.value })}
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="min_order">Min Order (৳) — optional</Label>
              <Input
                id="min_order"
                type="number"
                value={form.min_order}
                onChange={(e) => setForm({ ...form, min_order: e.target.value })}
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_discount">Max Discount (৳) — optional</Label>
              <Input
                id="max_discount"
                type="number"
                value={form.max_discount}
                onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
                placeholder="500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="usage_limit">Total Usage Limit — optional</Label>
              <Input
                id="usage_limit"
                type="number"
                value={form.usage_limit}
                onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                placeholder="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expires_at">Expiry Date — optional</Label>
              <Input
                id="expires_at"
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description — optional</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="10% welcome discount for new customers"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.first_time_only}
              onChange={(e) => setForm({ ...form, first_time_only: e.target.checked })}
              className="h-4 w-4 accent-accent"
            />
            First-time customers only
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Coupon"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
