"use client";

import * as React from "react";
import { Plus, MapPin, Edit, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = React.useState<Address[]>([
    {
      id: "1",
      label: "Home",
      firstName: "Tanvir",
      lastName: "Ahmed",
      phone: "+880 1711-123456",
      addressLine1: "House 12, Road 5, Dhanmondi",
      city: "Dhaka",
      district: "Dhaka",
      postalCode: "1205",
      isDefault: true,
    },
  ]);
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<Partial<Address>>({
    label: "",
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    city: "",
    district: "",
    postalCode: "",
    isDefault: false,
  });

  function openNew() {
    setEditingId(null);
    setFormData({
      label: "",
      firstName: "",
      lastName: "",
      phone: "",
      addressLine1: "",
      city: "",
      district: "",
      postalCode: "",
      isDefault: false,
    });
    setOpen(true);
  }

  function openEdit(addr: Address) {
    setEditingId(addr.id);
    setFormData(addr);
    setOpen(true);
  }

  function saveAddress() {
    if (
      !formData.firstName ||
      !formData.phone ||
      !formData.addressLine1 ||
      !formData.city
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...(formData as Address) }
            : formData.isDefault
            ? { ...a, isDefault: false }
            : a
        )
      );
      toast.success("Address updated");
    } else {
      const newAddr: Address = {
        id: Date.now().toString(),
        ...(formData as Address),
      };
      setAddresses((prev) =>
        newAddr.isDefault
          ? [...prev.map((a) => ({ ...a, isDefault: false })), newAddr]
          : [...prev, newAddr]
      );
      toast.success("Address added");
    }
    setOpen(false);
  }

  function deleteAddress(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address deleted");
  }

  function setDefault(id: string) {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    toast.success("Default address updated");
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            My Addresses
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your saved shipping addresses
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background p-12 text-center">
          <MapPin className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">No addresses saved</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add your first shipping address to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="relative rounded-lg border border-border/60 bg-background p-4"
            >
              {addr.isDefault && (
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                  <Check className="h-2.5 w-2.5" />
                  Default
                </span>
              )}
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                  {addr.label}
                </span>
              </div>
              <p className="text-sm font-medium">
                {addr.firstName} {addr.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{addr.phone}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {addr.addressLine1}
              </p>
              <p className="text-sm text-muted-foreground">
                {addr.city}, {addr.district} {addr.postalCode}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(addr)}
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAddress(addr.id)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
                {!addr.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDefault(addr.id)}
                    className="ml-auto"
                  >
                    Set Default
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  placeholder="Home, Office, etc."
                  value={formData.label || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address1">Address *</Label>
              <Input
                id="address1"
                placeholder="House #, Road #, Block"
                value={formData.addressLine1 || ""}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine1: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isDefault || false}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="h-4 w-4 rounded border-border"
              />
              Set as default address
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveAddress}>
              {editingId ? "Save Changes" : "Add Address"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
