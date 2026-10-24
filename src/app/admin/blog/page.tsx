"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  cover_image: string | null;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[] | null;
  is_featured: boolean | null;
  created_at: string;
  published_at: string | null;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);
  const [showEditor, setShowEditor] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<BlogPost | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchPosts = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch {
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function toggleStatus(post: BlogPost) {
    const newStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(newStatus === "PUBLISHED" ? "Post published" : "Post unpublished");
      fetchPosts();
    } else {
      toast.error(data.error || "Failed");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Post deleted");
        setDeleteTarget(null);
        fetchPosts();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  const publishedCount = posts.filter((p) => p.status === "PUBLISHED").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Blog Posts
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {posts.length} posts ({publishedCount} published)
          </p>
        </div>
        <Button onClick={() => { setEditingPost(null); setShowEditor(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">No blog posts yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create your first blog post to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3"
            >
              {/* Cover image thumbnail or icon */}
              {post.cover_image ? (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="h-12 w-16 shrink-0 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-muted">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
              )}

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium">{post.title}</p>
                  <Badge
                    variant="secondary"
                    className={
                      post.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {post.status}
                  </Badge>
                  {post.is_featured && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {post.category || "General"} ·{" "}
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => toggleStatus(post)}
                >
                  {post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                </Button>
                {post.status === "PUBLISHED" && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => { setEditingPost(post); setShowEditor(true); }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-500"
                  onClick={() => setDeleteTarget(post)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor dialog */}
      {showEditor && (
        <PostEditor
          post={editingPost}
          onClose={() => setShowEditor(false)}
          onSaved={() => { setShowEditor(false); fetchPosts(); }}
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
                Delete Post
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
              This action cannot be undone.
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

function PostEditor({
  post,
  onClose,
  onSaved,
}: {
  post: BlogPost | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEditing = !!post;
  const [form, setForm] = React.useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category: post?.category || "General",
    cover_image: post?.cover_image || "",
    status: post?.status || "DRAFT",
    meta_title: post?.meta_title || "",
    meta_description: post?.meta_description || "",
    tags: Array.isArray(post?.tags) ? (post!.tags as string[]).join(", ") : "",
    is_featured: !!post?.is_featured,
  });
  const [saving, setSaving] = React.useState(false);

  async function save() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const url = isEditing ? `/api/admin/blog/${post!.id}` : "/api/admin/blog";
      const method = isEditing ? "PATCH" : "POST";

      // Convert comma-separated tags into array
      const tagsArray = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Record<string, any> = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        cover_image: form.cover_image || null,
        status: form.status,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        tags: tagsArray,
        is_featured: form.is_featured,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(isEditing ? "Post updated" : "Post created");
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
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Post" : "New Blog Post"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Cover image */}
          <ImageUpload
            label="Feature Image (Cover)"
            value={form.cover_image}
            onChange={(url) => setForm({ ...form, cover_image: url })}
            folder="blog"
            aspectRatio="aspect-[16/10]"
            hint="Recommended size: 1600×1000px (16:10). Used as the blog post cover image."
          />

          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Post title"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-generated from title"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Style Guide"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="panjabi, style, wedding"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="DRAFT">Draft (not visible)</option>
                <option value="PUBLISHED">Published (visible on site)</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="h-4 w-4 rounded border-border"
            />
            <Label htmlFor="is_featured" className="cursor-pointer text-sm font-normal">
              Mark as Featured Post (shown highlighted on blog home)
            </Label>
          </div>
          <div className="space-y-2">
            <Label>Excerpt (short summary)</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              placeholder="Brief summary shown in blog listing"
            />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={10}
              placeholder="Full post content. Use blank lines to separate paragraphs."
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Separate paragraphs with a blank line. The content will be
              rendered with proper paragraph spacing on the blog page.
            </p>
          </div>

          {/* SEO Section */}
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <h4 className="mb-3 text-sm font-semibold">SEO Settings</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={form.meta_title}
                  onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                  placeholder="SEO title (defaults to post title if empty)"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 50–60 characters. Used in browser tab and search results.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={form.meta_description}
                  onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                  rows={2}
                  placeholder="SEO description (defaults to excerpt if empty)"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 150–160 characters. Shown in search engine results.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditing ? "Update Post" : "Create Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
