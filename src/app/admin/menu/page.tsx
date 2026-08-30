"use client";

import * as React from "react";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Menu as MenuIcon,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  label_bn: string;
  href: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  open_in_new_tab: boolean;
}

export default function AdminMenuPage() {
  const [items, setItems] = React.useState<NavItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingItem, setEditingItem] = React.useState<NavItem | null>(null);
  const [showEditor, setShowEditor] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<NavItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchItems = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/nav-menu");
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch {
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function toggleActive(item: NavItem) {
    const res = await fetch(`/api/admin/nav-menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !item.is_active }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(item.is_active ? "Menu item hidden" : "Menu item published");
      fetchItems();
    } else {
      toast.error(data.error || "Failed");
    }
  }

  async function moveItem(item: NavItem, direction: "up" | "down") {
    const idx = items.findIndex((i) => i.id === item.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;

    const swapItem = items[swapIdx];
    await Promise.all([
      fetch(`/api/admin/nav-menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: swapItem.sort_order }),
      }),
      fetch(`/api/admin/nav-menu/${swapItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: item.sort_order }),
      }),
    ]);
    fetchItems();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/nav-menu/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Menu item deleted");
        setDeleteTarget(null);
        fetchItems();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete menu item");
    } finally {
      setDeleting(false);
    }
  }

  function openNew() {
    setEditingItem(null);
    setShowEditor(true);
  }

  function openEdit(item: NavItem) {
    setEditingItem(item);
    setShowEditor(true);
  }

  const activeCount = items.filter((i) => i.is_active).length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Header Menu
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {items.length} items ({activeCount} visible on website)
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <MenuIcon className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">No menu items</p>
          <Button onClick={openNew} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add First Item
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors",
                item.is_active ? "border-border/60" : "border-border/40 opacity-60"
              )}
            >
              {/* Drag handle / sort order */}
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={idx === 0}
                  onClick={() => moveItem(item, "up")}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={idx === items.length - 1}
                  onClick={() => moveItem(item, "down")}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>

              {/* Item info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.label_bn && (
                    <span className="text-xs text-muted-foreground">({item.label_bn})</span>
                  )}
                  {item.is_active ? (
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Hidden</Badge>
                  )}
                  {item.open_in_new_tab && (
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline"
                >
                  {item.href}
                </a>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleActive(item)}
                  title={item.is_active ? "Hide" : "Show"}
                >
                  {item.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(item)}
                  title="Edit"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-500"
                  onClick={() => setDeleteTarget(item)}
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditor && (
        <ItemEditor
          item={editingItem}
          nextSortOrder={items.length}
          onClose={() => setShowEditor(false)}
          onSaved={() => {
            setShowEditor(false);
            fetchItems();
          }}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <Dialog open onOpenChange={() => setDeleteTarget(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
                Delete Menu Item?
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{deleteTarget.label}</strong>?
              <br />This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
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

function ItemEditor({
  item,
  nextSortOrder,
  onClose,
  onSaved,
}: {
  item: NavItem | null;
  nextSortOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEditing = !!item;
  const [form, setForm] = React.useState({
    label: item?.label || "",
    label_bn: item?.label_bn || "",
    href: item?.href || "/",
    sort_order: item?.sort_order ?? nextSortOrder,
    is_active: item?.is_active ?? true,
    open_in_new_tab: item?.open_in_new_tab ?? false,
  });
  const [saving, setSaving] = React.useState(false);

  async function save() {
    if (!form.label.trim() || !form.href.trim()) {
      toast.error("Label and URL are required");
      return;
    }
    setSaving(true);
    try {
      const url = isEditing ? `/api/admin/nav-menu/${item!.id}` : "/api/admin/nav-menu";
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(isEditing ? "Updated" : "Created");
        onSaved();
      } else {
        toast.error(data.error || "Failed");
      }
    } catch {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Label (English) *</Label>
              <Input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="Shop"
              />
            </div>
            <div className="space-y-2">
              <Label>Label (Bengali)</Label>
              <Input
                value={form.label_bn}
                onChange={(e) => setForm({ ...form, label_bn: e.target.value })}
                placeholder="শপ"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>URL *</Label>
            <Input
              value={form.href}
              onChange={(e) => setForm({ ...form, href: e.target.value })}
              placeholder="/shop"
            />
            <p className="text-[10px] text-muted-foreground">
              Internal links start with / (e.g. /shop). External links need https://
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="h-4 w-4 accent-accent"
                  />
                  Visible on site
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.open_in_new_tab}
                    onChange={(e) => setForm({ ...form, open_in_new_tab: e.target.checked })}
                    className="h-4 w-4 accent-accent"
                  />
                  Open in new tab
                </label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
