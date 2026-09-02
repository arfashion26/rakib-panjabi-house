"use client";

import * as React from "react";
import { Plus, MapPin, Edit, Trash2, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Address {
  id: string;
  type: string;
  first_name: string;
  last_name: string | null;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  district: string | null;
  thana: string | null;
  postal_code: string | null;
  is_default: boolean;
  label: string | null;
}

export default function AddressesPage() {
  const { t } = useLanguage();
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<Address>>({});

  React.useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/addresses");
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses || []);
      }
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setFormData({
      first_name: "",
      last_name: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      district: "",
      thana: "",
      postal_code: "",
      is_default: addresses.length === 0,
      label: "Home",
    });
    setOpen(true);
  }

  function openEdit(addr: Address) {
    setFormData(addr);
    setOpen(true);
  }

  async function handleSave() {
    if (!formData.first_name || !formData.phone || !formData.address_line1 || !formData.city) {
      toast.error(t("dashboard.fillAllFields"));
      return;
    }

    setSaving(true);
    try {
      const isEditing = formData.id;
      const url = isEditing
        ? `/api/dashboard/addresses?id=${formData.id}`
        : "/api/dashboard/addresses";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(isEditing ? t("dashboard.addressUpdated") : t("dashboard.addressAdded"));
        setOpen(false);
        fetchAddresses();
      } else {
        toast.error(data.error || t("dashboard.failedSaveAddress"));
      }
    } catch {
      toast.error(t("dashboard.failedSaveAddress"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("dashboard.confirmDeleteAddress"))) return;
    try {
      const res = await fetch(`/api/dashboard/addresses?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(t("dashboard.addressDeleted"));
        fetchAddresses();
      }
    } catch {
      toast.error(t("dashboard.failedDeleteAddress"));
    }
  }

  async function setDefault(id: string) {
    try {
      const res = await fetch(`/api/dashboard/addresses?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_default: true }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(t("dashboard.defaultAddressUpdated"));
        fetchAddresses();
      }
    } catch {
      toast.error(t("dashboard.failedUpdateDefault"));
    }
  }

  if (loading) {
    return (
      <div className="py-16 text-center">
        <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t("dashboard.loadingAddresses")}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            {t("dashboard.myAddresses")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {addresses.length} {t("dashboard.addressesDesc")}
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          {t("dashboard.addNew")}
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <MapPin className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">{t("dashboard.noAddresses")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("dashboard.noAddressesDesc")}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr.id} className="relative rounded-lg border border-border/60 bg-background p-4">
              {addr.is_default && (
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent-text">
                  <Check className="h-2.5 w-2.5" />
                  {t("dashboard.default")}
                </span>
              )}
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                  {addr.label || t("dashboard.address")}
                </span>
              </div>
              <p className="text-sm font-medium">
                {addr.first_name} {addr.last_name}
              </p>
              <p className="text-sm text-muted-foreground">{addr.phone}</p>
              <p className="mt-2 text-sm text-muted-foreground">{addr.address_line1}</p>
              <p className="text-sm text-muted-foreground">
                {addr.city}{addr.district ? `, ${addr.district}` : ""}{addr.postal_code ? ` ${addr.postal_code}` : ""}
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(addr)}>
                  <Edit className="mr-1 h-3 w-3" />
                  {t("common.edit")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-red-500"
                  onClick={() => handleDelete(addr.id)}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  {t("dashboard.delete")}
                </Button>
                {!addr.is_default && (
                  <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setDefault(addr.id)}>
                    {t("dashboard.setDefault")}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formData.id ? t("dashboard.editAddress") : t("dashboard.addAddress")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("dashboard.firstName")} *</Label>
                <Input id="firstName" value={formData.first_name || ""} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("dashboard.lastName")}</Label>
                <Input id="lastName" value={formData.last_name || ""} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("dashboard.phone")} *</Label>
                <Input id="phone" value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">{t("dashboard.label")}</Label>
                <Input id="label" placeholder="Home, Office..." value={formData.label || ""} onChange={(e) => setFormData({ ...formData, label: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address1">{t("dashboard.address")} *</Label>
              <Input id="address1" placeholder="House #, Road #, Block" value={formData.address_line1 || ""} onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">{t("dashboard.city")} *</Label>
                <Input id="city" value={formData.city || ""} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">{t("dashboard.district")}</Label>
                <Input id="district" value={formData.district || ""} onChange={(e) => setFormData({ ...formData, district: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">{t("dashboard.postalCode")}</Label>
                <Input id="postalCode" value={formData.postal_code || ""} onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.is_default || false} onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })} className="h-4 w-4 rounded border-border" />
              {t("dashboard.setAsDefault")}
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {formData.id ? t("dashboard.saveChanges") : t("dashboard.addAddress")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
