"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, Package, X, Loader2, AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { formatPrice } from "@/lib/types";
import { toast } from "sonner";

interface ProductSize {
  id?: string;
  size: string;
  stock: number;
  sort_order?: number;
}

interface ProductColor {
  id?: string;
  name: string;
  hex_value: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description?: string;
  fabric?: string;
  fit?: string;
  care?: string;
  origin?: string;
  price: number;
  discount_price?: number;
  status: string;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_flash_sale: boolean;
  category_id: string;
  sizes?: ProductSize[];
  colors?: ProductColor[];
  images?: { url: string; is_primary: boolean }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const PRESET_COLORS = [
  { name: "Black", hex: "#1a1a1f" },
  { name: "White", hex: "#ffffff" },
  { name: "Navy", hex: "#1a237e" },
  { name: "Maroon", hex: "#800020" },
  { name: "Olive", hex: "#556b2f" },
  { name: "Brown", hex: "#8b6f47" },
  { name: "Sand", hex: "#d2b48c" },
  { name: "Grey", hex: "#8b8b8b" },
  { name: "Emerald", hex: "#0f5132" },
  { name: "Ivory", hex: "#f5f1e8" },
  { name: "Gold", hex: "#b8860b" },
  { name: "Indigo", hex: "#1a237e" },
];

const PRESET_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "38", "40", "42", "44", "46", "30", "32", "34", "36", "38"];

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Product | null>(null);

  // Load products from API
  const loadProducts = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        // If DB not set up, use sample data
        setProducts([]);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load categories
  const loadCategories = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch {
      // Categories not available
    }
  }, []);

  React.useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSave(product: Product) {
    setSaving(true);
    try {
      // If product has a real ID (not empty), it's an edit (PUT)
      // Otherwise it's a new product (POST)
      const isEditing = product.id && product.id.length > 0;
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/admin/products?id=${product.id}`
        : "/api/admin/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          brandId: null,
          shortDescription: product.short_description,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(isEditing ? "Product updated" : "Product created");
        setIsDialogOpen(false);
        setEditingProduct(null);
        loadProducts();
      } else {
        toast.error(data.error || "Failed to save product");
      }
    } catch (e: any) {
      toast.error("Network error: " + (e?.message || "Failed to save product"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    try {
      const res = await fetch(`/api/admin/products?id=${product.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Product deleted successfully");
        setDeleteConfirm(null);
        loadProducts();
      } else {
        toast.error(data.error || "Failed to delete product");
        setDeleteConfirm(null);
      }
    } catch (e: any) {
      toast.error("Network error — failed to delete product");
      setDeleteConfirm(null);
    }
  }

  function openNew() {
    setEditingProduct({
      id: "",
      name: "",
      slug: "",
      sku: "",
      description: "",
      price: 0,
      status: "DRAFT",
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: false,
      is_flash_sale: false,
      category_id: categories[0]?.id || "",
      sizes: [],
      colors: [],
      images: [],
    });
    setIsDialogOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct({ ...product });
    setIsDialogOpen(true);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Products
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {products.length} products total · {products.filter(p => p.status === "ACTIVE").length} active
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">
            {search ? "No products match your search" : "No products yet"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {search ? "Try a different search term" : "Click 'Add Product' to create your first product"}
          </p>
          {!search && (
            <Button onClick={openNew} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Product
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
                  <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
                  <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</th>
                  <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((product) => {
                  const totalStock = (product.sizes || []).reduce((sum, s) => sum + s.stock, 0) +
                    (product.colors || []).reduce((sum, c) => sum + c.stock, 0);
                  return (
                    <tr key={product.id} className="hover:bg-muted/20">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-md bg-muted" />
                          <div className="min-w-0">
                            <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
                            <div className="mt-0.5 flex items-center gap-1">
                              {product.is_featured && <Badge variant="secondary" className="h-4 text-[10px]">Featured</Badge>}
                              {product.is_best_seller && <Badge variant="secondary" className="h-4 bg-accent/10 text-accent text-[10px]">Best</Badge>}
                              {product.is_new_arrival && <Badge variant="secondary" className="h-4 text-[10px]">New</Badge>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{product.sku}</td>
                      <td className="p-3 text-right text-sm font-medium">
                        {formatPrice(product.discount_price || product.price)}
                        {product.discount_price && (
                          <div className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center text-sm">
                        {totalStock > 0 ? (
                          <span className={totalStock < 10 ? "text-orange-600 font-medium" : ""}>
                            {totalStock}
                          </span>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-700">Out</Badge>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="secondary" className={
                          product.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                          product.status === "DRAFT" ? "bg-yellow-100 text-yellow-700" :
                          "bg-muted text-muted-foreground"
                        }>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/product/${product.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                            onClick={() => setDeleteConfirm(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      {editingProduct && (
        <ProductFormDialog
          product={editingProduct}
          categories={categories}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSave}
          saving={saving}
          isEditing={!!editingProduct.id}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Delete Product?
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete <strong className="text-foreground">{deleteConfirm.name}</strong>?
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                This will permanently remove the product along with its sizes, colors, and images.
                This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

/**
 * Product Form Dialog — full form with sizes, colors, stock management
 */
function ProductFormDialog({
  product,
  categories,
  open,
  onOpenChange,
  onSave,
  saving,
  isEditing,
}: {
  product: Product;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Product) => void;
  saving: boolean;
  isEditing: boolean;
}) {
  const [form, setForm] = React.useState<Product>(product);

  React.useEffect(() => {
    setForm(product);
  }, [product]);

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Size management
  function addSize(size: string) {
    if (!size) return;
    if (form.sizes?.some((s) => s.size === size)) {
      toast.error("Size already added");
      return;
    }
    update("sizes", [...(form.sizes || []), { size, stock: 0 }]);
  }

  function updateSizeStock(idx: number, stock: number) {
    const sizes = [...(form.sizes || [])];
    sizes[idx] = { ...sizes[idx], stock };
    update("sizes", sizes);
  }

  function removeSize(idx: number) {
    const sizes = (form.sizes || []).filter((_, i) => i !== idx);
    update("sizes", sizes);
  }

  // Color management
  function addColor(name: string, hex: string) {
    if (!name || !hex) return;
    if (form.colors?.some((c) => c.name === name)) {
      toast.error("Color already added");
      return;
    }
    update("colors", [...(form.colors || []), { name, hex_value: hex, stock: 0 }]);
  }

  function updateColorStock(idx: number, stock: number) {
    const colors = [...(form.colors || [])];
    colors[idx] = { ...colors[idx], stock };
    update("colors", colors);
  }

  function removeColor(idx: number) {
    const colors = (form.colors || []).filter((_, i) => i !== idx);
    update("colors", colors);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Basic Information
            </h3>
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  required
                  value={form.sku}
                  onChange={(e) => update("sku", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  placeholder="auto-generated if empty"
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                rows={4}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Pricing & Category */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Pricing & Category
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price (৳) *</Label>
                <Input
                  id="price"
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Price</Label>
                <Input
                  id="discount"
                  type="number"
                  value={form.discount_price || ""}
                  onChange={(e) => update("discount_price", e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.category_id}
                  onValueChange={(v) => update("category_id", v)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* SIZES with Stock */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Sizes & Stock
            </h3>
            <p className="text-xs text-muted-foreground">
              Add available sizes for this product. Set stock for each size.
              If a size is out of stock, it will show as &quot;Out of Stock&quot; on the product page.
            </p>

            {/* Existing sizes */}
            {form.sizes && form.sizes.length > 0 && (
              <div className="space-y-2">
                {form.sizes.map((size, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex h-9 w-12 items-center justify-center rounded-md border border-border bg-muted/50 text-sm font-medium">
                      {size.size}
                    </div>
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={size.stock}
                      onChange={(e) => updateSizeStock(idx, parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <span className="text-xs text-muted-foreground">in stock</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-8 w-8 text-muted-foreground hover:text-red-500"
                      onClick={() => removeSize(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Quick add sizes */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_SIZES.filter((s) => !form.sizes?.some((fs) => fs.size === s)).map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => addSize(size)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  {size}
                </Button>
              ))}
            </div>

            {/* Custom size input */}
            <div className="flex gap-2">
              <Input
                id="custom-size"
                placeholder="Custom size (e.g. 42)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.target as HTMLInputElement;
                    addSize(input.value);
                    input.value = "";
                  }
                }}
              />
            </div>
          </div>

          <Separator />

          {/* COLORS with Stock */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Colors & Stock
            </h3>
            <p className="text-xs text-muted-foreground">
              Add available colors. Set stock for each color. Customers will see
              only the colors that are in stock.
            </p>

            {/* Existing colors */}
            {form.colors && form.colors.length > 0 && (
              <div className="space-y-2">
                {form.colors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="h-9 w-9 rounded-full border border-border"
                      style={{ backgroundColor: color.hex_value }}
                    />
                    <Input
                      value={color.name}
                      onChange={(e) => {
                        const colors = [...(form.colors || [])];
                        colors[idx] = { ...colors[idx], name: e.target.value };
                        update("colors", colors);
                      }}
                      className="w-32"
                    />
                    <Input
                      type="color"
                      value={color.hex_value}
                      onChange={(e) => {
                        const colors = [...(form.colors || [])];
                        colors[idx] = { ...colors[idx], hex_value: e.target.value };
                        update("colors", colors);
                      }}
                      className="h-9 w-12 cursor-pointer p-1"
                    />
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={color.stock}
                      onChange={(e) => updateColorStock(idx, parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-8 w-8 text-muted-foreground hover:text-red-500"
                      onClick={() => removeColor(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Quick add colors */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_COLORS.filter((c) => !form.colors?.some((fc) => fc.name === c.name)).map((color) => (
                <Button
                  key={color.name}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5"
                  onClick={() => addColor(color.name, color.hex)}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-border"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Product Images */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Product Images
            </h3>
            <p className="text-xs text-muted-foreground">
              Upload a main product image and additional gallery images. The first image will be used as the main product image.
            </p>

            {/* Image gallery management */}
            <div className="space-y-3">
              {/* Main/Featured image */}
              <ImageUpload
                label="Main Product Image"
                value={form.images?.[0]?.url || ""}
                onChange={(url) => {
                  const newImages = [...(form.images || [])];
                  if (url) {
                    if (newImages.length > 0) {
                      newImages[0] = { url, is_primary: true };
                    } else {
                      newImages.push({ url, is_primary: true });
                    }
                  } else {
                    newImages.shift();
                  }
                  setForm({ ...form, images: newImages });
                }}
                folder={`products/${form.sku || "general"}`}
                aspectRatio="aspect-[3/4]"
                hint="Recommended: 600×800px (portrait)"
              />

              {/* Additional gallery images */}
              {[1, 2, 3].map((idx) => (
                <ImageUpload
                  key={idx}
                  label={`Gallery Image ${idx}`}
                  value={form.images?.[idx]?.url || ""}
                  onChange={(url) => {
                    const newImages = [...(form.images || [])];
                    if (url) {
                      newImages[idx] = { url, is_primary: false };
                    } else {
                      newImages.splice(idx, 1);
                    }
                    setForm({ ...form, images: newImages });
                  }}
                  folder={`products/${form.sku || "general"}`}
                  aspectRatio="aspect-[3/4]"
                />
              ))}
            </div>
          </div>

          <Separator />

          {/* Attributes */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Attributes (Optional)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="fabric">Fabric</Label>
                <Input
                  id="fabric"
                  placeholder="e.g. 100% Cotton"
                  value={form.fabric || ""}
                  onChange={(e) => update("fabric", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fit">Fit</Label>
                <Input
                  id="fit"
                  placeholder="e.g. Regular Fit"
                  value={form.fit || ""}
                  onChange={(e) => update("fit", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Status & Flags */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Status & Visibility
            </h3>
            <div className="space-y-2">
              <Label htmlFor="status">Product Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => update("status", v)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft (not visible)</SelectItem>
                  <SelectItem value="ACTIVE">Active (visible on site)</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                  <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center justify-between rounded-md border border-border p-3">
                <span className="text-sm">Featured</span>
                <Switch
                  checked={form.is_featured}
                  onCheckedChange={(v) => update("is_featured", v)}
                />
              </label>
              <label className="flex items-center justify-between rounded-md border border-border p-3">
                <span className="text-sm">Best Seller</span>
                <Switch
                  checked={form.is_best_seller}
                  onCheckedChange={(v) => update("is_best_seller", v)}
                />
              </label>
              <label className="flex items-center justify-between rounded-md border border-border p-3">
                <span className="text-sm">New Arrival</span>
                <Switch
                  checked={form.is_new_arrival}
                  onCheckedChange={(v) => update("is_new_arrival", v)}
                />
              </label>
              <label className="flex items-center justify-between rounded-md border border-border p-3">
                <span className="text-sm">Flash Sale</span>
                <Switch
                  checked={form.is_flash_sale}
                  onCheckedChange={(v) => update("is_flash_sale", v)}
                />
              </label>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="product-form" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              isEditing ? "Save Changes" : "Create Product"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
