"use client";

import * as React from "react";
import {
  Star,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  Quote,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface Review {
  id: string;
  customer_name: string;
  customer_location: string;
  product_name: string;
  rating: number;
  review_text: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showEditor, setShowEditor] = React.useState(false);
  const [editingReview, setEditingReview] = React.useState<Review | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Review | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchReviews = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function toggleActive(review: Review) {
    const res = await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !review.is_active }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(review.is_active ? "Review hidden" : "Review published");
      fetchReviews();
    } else {
      toast.error(data.error || "Failed to update");
    }
  }

  async function moveReview(review: Review, direction: "up" | "down") {
    const idx = reviews.findIndex((r) => r.id === review.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= reviews.length) return;

    const swapReview = reviews[swapIdx];
    // Swap sort_order values
    await Promise.all([
      fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: swapReview.sort_order }),
      }),
      fetch(`/api/admin/reviews/${swapReview.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: review.sort_order }),
      }),
    ]);
    fetchReviews();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reviews/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Review deleted");
        setDeleteTarget(null);
        fetchReviews();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeleting(false);
    }
  }

  function openNew() {
    setEditingReview(null);
    setShowEditor(true);
  }

  function openEdit(review: Review) {
    setEditingReview(review);
    setShowEditor(true);
  }

  const activeCount = reviews.filter((r) => r.is_active).length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Homepage Reviews
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {reviews.length} reviews ({activeCount} active on homepage)
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Review
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Quote className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">No reviews yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add customer reviews to display on your homepage.
          </p>
          <Button onClick={openNew} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add First Review
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, idx) => (
            <div
              key={review.id}
              className={cn(
                "rounded-lg border bg-background p-4 transition-colors",
                review.is_active
                  ? "border-border/60"
                  : "border-border/40 opacity-60"
              )}
            >
              <div className="flex items-start gap-4">
                {/* Rating + quote */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Quote className="h-5 w-5 text-accent" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{review.customer_name}</p>
                        {review.is_active ? (
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Hidden</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {review.customer_location || "—"}
                        {review.product_name ? ` · ${review.product_name}` : ""}
                      </p>
                    </div>
                    {/* Rating stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3.5 w-3.5",
                            i < review.rating
                              ? "fill-accent text-accent"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    &ldquo;{review.review_text}&rdquo;
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  {/* Reorder */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={idx === 0}
                    onClick={() => moveReview(review, "up")}
                    title="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={idx === reviews.length - 1}
                    onClick={() => moveReview(review, "down")}
                    title="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  {/* Toggle visibility */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleActive(review)}
                    title={review.is_active ? "Hide" : "Show"}
                  >
                    {review.is_active ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  {/* Edit */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(review)}
                    title="Edit"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    onClick={() => setDeleteTarget(review)}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor dialog */}
      {showEditor && (
        <ReviewEditor
          review={editingReview}
          onClose={() => setShowEditor(false)}
          onSaved={() => {
            setShowEditor(false);
            fetchReviews();
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
                Delete Review?
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete the review from <strong>{deleteTarget.customer_name}</strong>?
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

function ReviewEditor({
  review,
  onClose,
  onSaved,
}: {
  review: Review | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEditing = !!review;
  const [form, setForm] = React.useState({
    customer_name: review?.customer_name || "",
    customer_location: review?.customer_location || "",
    product_name: review?.product_name || "",
    rating: review?.rating || 5,
    review_text: review?.review_text || "",
    is_active: review?.is_active ?? true,
    sort_order: review?.sort_order ?? 0,
  });
  const [saving, setSaving] = React.useState(false);

  function update<K extends keyof typeof form>(key: K, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!form.customer_name.trim() || !form.review_text.trim()) {
      toast.error("Customer name and review text are required");
      return;
    }
    setSaving(true);
    try {
      const url = isEditing
        ? `/api/admin/reviews/${review!.id}`
        : "/api/admin/reviews";
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(isEditing ? "Review updated" : "Review created");
        onSaved();
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Review" : "Add New Review"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name *</Label>
              <Input
                id="customer_name"
                value={form.customer_name}
                onChange={(e) => update("customer_name", e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_location">Location</Label>
              <Input
                id="customer_location"
                value={form.customer_location}
                onChange={(e) => update("customer_location", e.target.value)}
                placeholder="Dhaka"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="product_name">Product Name</Label>
              <Input
                id="product_name"
                value={form.product_name}
                onChange={(e) => update("product_name", e.target.value)}
                placeholder="Premium Cotton Panjabi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => update("rating", n)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors",
                        n <= form.rating
                          ? "fill-accent text-accent"
                          : "text-muted-foreground/30 hover:text-accent"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review_text">Review Text *</Label>
            <Textarea
              id="review_text"
              value={form.review_text}
              onChange={(e) => update("review_text", e.target.value)}
              rows={4}
              placeholder="The quality exceeded my expectations..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={form.sort_order}
                onChange={(e) => update("sort_order", Number(e.target.value))}
                placeholder="0"
              />
              <p className="text-[10px] text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>
            <div className="space-y-2">
              <Label>Visibility</Label>
              <label className="flex h-10 items-center gap-2 rounded-md border border-border px-3">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => update("is_active", e.target.checked)}
                  className="h-4 w-4 accent-accent"
                />
                <span className="text-sm">Show on homepage</span>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              isEditing ? "Update Review" : "Create Review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
