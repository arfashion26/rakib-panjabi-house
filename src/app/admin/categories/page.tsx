"use client";

import * as React from "react";
import { Plus, Edit, Trash2, Loader2, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  is_featured: boolean;
  is_active: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState<Category | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Category | null>(null);

  const loadCategories = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function openNew() {
    setEditing({
      id: "",
      name: "",
      slug: "",
      description: "",
      image: "",
      order: categories.length + 1,
      is_featured: false,
      is_active: true,
    });
    setIsOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing({ ...cat });
    setIsOpen(true);
  }

  async function handleSave(category: Category) {
    setSaving(true);
    try {
      const method = category.id ? "PUT" : "POST";
      const url = category.id
        ? `/api/admin/categories?id=${category.id}`
        : "/api/admin/categories";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: category.name,
          slug: category.slug || undefined,
          description: category.description || undefined,
          image: category.image || undefined,
          order: category.order,
          isFeatured: category.is_featured,
          isActive: category.is_active,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(category.id ? "Category updated" : "Category created");
        setIsOpen(false);
        setEditing(null);
        loadCategories();
      } else {
        toast.error(data.error || "Failed to save category");
      }
    } catch {
      toast.error("Failed to save category");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category: Category) {
    try {
      const res = await fetch(`/api/admin/categories?id=${category.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Category deleted");
        setDeleteConfirm(null);
        loadCategories();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete category");
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Categories
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {categories.length} categories · {categories.filter((c) => c.is_featured).length} featured
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm font-medium">No categories yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Click &quot;Add Category&quot; to create your first category
          </p>
          <Button onClick={openNew} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add First Category
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug</th>
                  <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order</th>
                  <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Featured</th>
                  <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/20">
                    <td className="p-3">
                      <p className="text-sm font-medium">{cat.name}</p>
                      {cat.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{cat.description}</p>
                      )}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{cat.slug}</td>
                    <td className="p-3 text-center text-sm">{cat.order}</td>
                    <td className="p-3 text-center">
                      {cat.is_featured && (
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          Featured
                        </Badge>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary" className={cat.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}>
                        {cat.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(cat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => setDeleteConfirm(cat)}
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

      {/* Add/Edit Dialog */}
      {editing && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing.id ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Category Name *</Label>
                <Input
                  id="cat-name"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-slug">Slug (URL)</Label>
                <Input
                  id="cat-slug"
                  placeholder="auto-generated if empty"
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-desc">Description</Label>
                <Textarea
                  id="cat-desc"
                  rows={3}
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              {/* Category Image Upload */}
              <ImageUpload
                label="Category Image"
                value={editing.image || ""}
                onChange={(url) => setEditing({ ...editing, image: url })}
                folder={`categories/${editing.slug || "general"}`}
                aspectRatio="aspect-[3/4]"
                hint="Recommended: 450×600px (portrait). Shown on homepage featured categories."
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="cat-order">Display Order</Label>
                  <Input
                    id="cat-order"
                    type="number"
                    value={editing.order}
                    onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-end gap-3 pb-2">
                  <label className="flex items-center gap-2">
                    <Switch
                      checked={editing.is_featured}
                      onCheckedChange={(v) => setEditing({ ...editing, is_featured: v })}
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-2">
                <Switch
                  checked={editing.is_active}
                  onCheckedChange={(v) => setEditing({ ...editing, is_active: v })}
                />
                <span className="text-sm">Active (visible on site)</span>
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={() => handleSave(editing)} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editing.id ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Delete Category?
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete the category{" "}
                <strong className="text-foreground">{deleteConfirm.name}</strong>?
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Note: You can only delete categories that have no products. If this
                category has products, move them first.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
                Delete Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
