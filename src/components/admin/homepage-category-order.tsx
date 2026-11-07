"use client";

import * as React from "react";
import { ArrowUp, ArrowDown, Home, Loader2, RefreshCw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  is_featured: boolean;
  parent_id?: string | null;
}

interface HomepageCategoryOrderProps {
  /** All categories — used to display names + filter to main + featured */
  categories: Category[];
}

/**
 * HomepageCategoryOrder
 *
 * Admin UI to control the display order of categories on the homepage's
 * "Featured Categories" section.
 *
 * Shows main (parent) categories that are marked as featured, with up/down
 * arrows to reorder them. The order is persisted to the settings table
 * (key: `homepage_category_order`) as a JSON array of category IDs.
 *
 * Categories not in the order list fall to the end (in their existing
 * order) when rendered on the homepage.
 */
export function HomepageCategoryOrder({ categories }: HomepageCategoryOrderProps) {
  const [order, setOrder] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  // Load the current order from the API
  const fetchOrder = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/homepage-category-order");
      const data = await res.json();
      if (data.success) {
        setOrder(data.order || []);
      }
    } catch {
      toast.error("Failed to load homepage category order");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // The categories that should appear in the homepage order UI:
  // main (parent) categories only, featured preferred but show all mains
  const mainCategories = React.useMemo(() => {
    return categories
      .filter((c) => !c.parent_id)
      .sort((a, b) => {
        // Featured first, then alphabetical
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, [categories]);

  // Build the display list: ordered IDs first (in their order), then any
  // remaining main categories not yet in the order array
  const displayList = React.useMemo(() => {
    const ordered: Category[] = [];
    const seen = new Set<string>();

    // Add categories in the configured order
    for (const id of order) {
      const cat = mainCategories.find((c) => c.id === id);
      if (cat) {
        ordered.push(cat);
        seen.add(id);
      }
    }

    // Add remaining main categories not in the order
    for (const cat of mainCategories) {
      if (!seen.has(cat.id)) {
        ordered.push(cat);
      }
    }

    return ordered;
  }, [order, mainCategories]);

  function moveUp(idx: number) {
    if (idx === 0) return;
    const newList = [...displayList];
    [newList[idx - 1], newList[idx]] = [newList[idx], newList[idx - 1]];
    saveOrder(newList.map((c) => c.id));
  }

  function moveDown(idx: number) {
    if (idx === displayList.length - 1) return;
    const newList = [...displayList];
    [newList[idx + 1], newList[idx]] = [newList[idx], newList[idx + 1]];
    saveOrder(newList.map((c) => c.id));
  }

  function moveToTop(idx: number) {
    if (idx === 0) return;
    const newList = [...displayList];
    const [item] = newList.splice(idx, 1);
    newList.unshift(item);
    saveOrder(newList.map((c) => c.id));
  }

  async function saveOrder(newOrder: string[]) {
    setOrder(newOrder); // optimistic update
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage-category-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Homepage category order updated");
      } else {
        toast.error(data.error || "Failed to save order");
        // Revert on failure
        fetchOrder();
      }
    } catch {
      toast.error("Failed to save order");
      fetchOrder();
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-border/60 bg-background p-6">
        <div className="mb-3 flex items-center gap-2">
          <Home className="h-5 w-5 text-accent-text" />
          <h2 className="font-serif text-lg font-medium">Homepage Category Order</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/60 bg-background p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-accent-text" />
            <h2 className="font-serif text-lg font-medium">Homepage Category Order</h2>
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Control the display order of categories on the homepage&apos;s &quot;Featured Categories&quot; section.
            Use the arrows to reorder — changes save automatically.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrder} disabled={saving}>
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      {displayList.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">No main categories available.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create categories first to control their homepage display order.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {displayList.map((cat, idx) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 rounded-md border border-border/40 bg-muted/20 px-3 py-2"
            >
              {/* Position number */}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {idx + 1}
              </span>

              {/* Category info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium capitalize">{cat.name}</p>
                <p className="text-xs text-muted-foreground">/{cat.slug}</p>
              </div>

              {/* Featured badge */}
              {cat.is_featured ? (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                  <Eye className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  <EyeOff className="mr-1 h-3 w-3" />
                  Hidden
                </Badge>
              )}

              {/* Reorder buttons */}
              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveToTop(idx)}
                  disabled={idx === 0 || saving}
                  aria-label="Move to top"
                  title="Move to top"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                  <ArrowUp className="-mt-2 h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0 || saving}
                  aria-label="Move up"
                  title="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveDown(idx)}
                  disabled={idx === displayList.length - 1 || saving}
                  aria-label="Move down"
                  title="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-md bg-muted/40 p-3">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Note:</strong> Only categories marked as
          &quot;Featured&quot; appear on the homepage. Use the table below to toggle the
          Featured flag for any category. Non-featured categories in this list are shown
          for reference but won&apos;t be visible on the homepage.
        </p>
      </div>
    </div>
  );
}
