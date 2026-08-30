"use client";

import * as React from "react";
import {
  Star,
  Check,
  X,
  Trash2,
  Loader2,
  MessageSquare,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  product_id: string;
  user_id: string | null;
  rating: number;
  title: string | null;
  content: string | null;
  status: string;
  is_verified: boolean;
  created_at: string;
  product?: { name: string; slug: string } | null;
  reviewer_name: string;
}

export default function AdminProductReviewsPage() {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState("all");
  const [deleteTarget, setDeleteTarget] = React.useState<Review | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const fetchReviews = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/product-reviews?status=${filter}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function updateStatus(review: Review, status: string) {
    const res = await fetch(`/api/admin/product-reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(status === "APPROVED" ? "Review approved" : "Review rejected");
      fetchReviews();
    } else {
      toast.error(data.error || "Failed");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/product-reviews/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Review deleted");
        setDeleteTarget(null);
        fetchReviews();
      } else {
        toast.error(data.error || "Failed");
      }
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeleting(false);
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  const filtered = filter === "all" ? reviews : reviews;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Product Reviews
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Approve or reject customer reviews
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors",
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <MessageSquare className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">No reviews found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Customer reviews will appear here for approval
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((review) => (
            <div
              key={review.id}
              className={cn(
                "rounded-lg border bg-background p-4 transition-colors",
                review.status === "PENDING" ? "border-yellow-200 bg-yellow-50/30" : "border-border/60"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  {review.reviewer_name[0]?.toUpperCase() || "A"}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{review.reviewer_name}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={cn(
                            "h-3 w-3",
                            n <= review.rating ? "fill-accent text-accent" : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                    <Badge className={statusColors[review.status] || "bg-muted text-muted-foreground"}>
                      {review.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Product */}
                  {review.product && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      on: <span className="font-medium">{review.product.name}</span>
                    </p>
                  )}

                  {/* Title + Content (expandable) */}
                  {review.title && (
                    <p className="mt-1.5 text-sm font-medium">{review.title}</p>
                  )}
                  {review.content && (
                    <p
                      className={cn(
                        "mt-1 text-sm text-muted-foreground",
                        expanded === review.id ? "" : "line-clamp-2"
                      )}
                    >
                      {review.content}
                    </p>
                  )}
                  {review.content && review.content.length > 100 && (
                    <button
                      onClick={() => setExpanded(expanded === review.id ? null : review.id)}
                      className="mt-1 text-xs text-accent hover:underline"
                    >
                      {expanded === review.id ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  {review.status !== "APPROVED" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:bg-green-50"
                      onClick={() => updateStatus(review, "APPROVED")}
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {review.status !== "REJECTED" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-orange-600 hover:bg-orange-50"
                      onClick={() => updateStatus(review, "REJECTED")}
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    onClick={() => setDeleteTarget(review)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
              Review by <strong>{deleteTarget.reviewer_name}</strong>
              {deleteTarget.title && ` — "${deleteTarget.title}"`}
              <br />This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
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
