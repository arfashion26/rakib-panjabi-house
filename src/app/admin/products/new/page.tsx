"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { placeholderCategories } from "@/lib/placeholder-data";
import { toast } from "sonner";

export default function NewProductPage() {
  const [saving, setSaving] = React.useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Product saved as draft");
    }, 1500);
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-accent"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Products
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Add New Product
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={saving}>
            Save as Draft
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main form */}
        <div className="space-y-6">
          {/* Basic info */}
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 font-serif text-lg font-medium">Basic Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" placeholder="e.g. Premium Cotton Panjabi — Emerald" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input id="sku" placeholder="RPH-PAN-001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input id="slug" placeholder="premium-cotton-panjabi-emerald" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="short">Short Description</Label>
                <Input id="short" placeholder="One-line summary for product cards" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Full Description *</Label>
                <Textarea
                  id="desc"
                  rows={6}
                  placeholder="Detailed product description..."
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 font-serif text-lg font-medium">Pricing</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price (৳) *</Label>
                <Input id="price" type="number" placeholder="2499" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Price</Label>
                <Input id="discount" type="number" placeholder="1999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost Price</Label>
                <Input id="cost" type="number" placeholder="1200" />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 font-serif text-lg font-medium">Inventory & Variants</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" type="number" placeholder="100" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sizes">Sizes (comma separated)</Label>
                  <Input id="sizes" placeholder="S, M, L, XL, XXL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colors">Colors (name:hex, comma separated)</Label>
                  <Input id="colors" placeholder="Black:#000, White:#fff" />
                </div>
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 font-serif text-lg font-medium">Attributes</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fabric">Fabric</Label>
                <Input id="fabric" placeholder="100% Cotton" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fit">Fit</Label>
                <Input id="fit" placeholder="Regular Fit" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="care">Care Instructions</Label>
                <Input id="care" placeholder="Machine wash cold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input id="origin" placeholder="Made in Bangladesh" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 font-serif text-lg font-medium">Status</h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="status">Product Status</Label>
                <Select defaultValue="DRAFT">
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 rounded border-border" />
                Featured product
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 rounded border-border" />
                Best seller
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 rounded border-border" />
                New arrival
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 rounded border-border" />
                Flash sale
              </label>
            </div>
          </div>

          {/* Organization */}
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 font-serif text-lg font-medium">Organization</h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {placeholderCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rph-premium">Rakib Premium</SelectItem>
                    <SelectItem value="rph-essentials">Rakib Essentials</SelectItem>
                    <SelectItem value="rph-formal">Rakib Formal</SelectItem>
                    <SelectItem value="rph-royal">Rakib Royal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="panjabi, cotton, premium" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="rounded-lg border border-border/60 bg-background p-6">
            <h2 className="mb-4 font-serif text-lg font-medium">Images</h2>
            <div className="rounded-md border-2 border-dashed border-border p-8 text-center">
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Upload images</p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP up to 5MB
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Choose Files
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
