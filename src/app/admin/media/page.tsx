"use client";

import * as React from "react";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Loader2,
  Search,
  Copy,
  Check,
  Eye,
  X,
  AlertCircle,
  Folder,
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

interface MediaImage {
  name: string;
  path: string;
  url: string;
  size: number;
  created_at: string;
  folder: string;
}

export default function AdminMediaPage() {
  const [images, setImages] = React.useState<MediaImage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [folderFilter, setFolderFilter] = React.useState<string>("all");
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<MediaImage | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<MediaImage | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

  const fetchImages = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.success) {
        setImages(data.images || []);
      } else {
        toast.error(data.error || "Failed to load images");
      }
    } catch {
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Get unique folders
  const folders = React.useMemo(() => {
    const set = new Set<string>();
    images.forEach((img) => set.add(img.folder));
    return Array.from(set).sort();
  }, [images]);

  // Filter images
  const filtered = images.filter((img) => {
    const matchesSearch =
      !search ||
      img.name.toLowerCase().includes(search.toLowerCase()) ||
      img.path.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = folderFilter === "all" || img.folder === folderFilter;
    return matchesSearch && matchesFolder;
  });

  // Calculate total size
  const totalSize = images.reduce((sum, img) => sum + (img.size || 0), 0);

  function formatSize(bytes: number) {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopiedUrl(null), 2000);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/media?path=${encodeURIComponent(deleteTarget.path)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Image deleted");
        setDeleteTarget(null);
        fetchImages();
      } else {
        toast.error(data.error || "Failed to delete image");
      }
    } catch {
      toast.error("Failed to delete image");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Media Library
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {images.length} images · {formatSize(totalSize)} total
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search images by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Folder filter */}
        <div className="flex items-center gap-1.5">
          <Folder className="h-4 w-4 text-muted-foreground" />
          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="all">All folders</option>
            {folders.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Images grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <ImageIcon className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium">
            {search || folderFilter !== "all"
              ? "No images match your filters"
              : "No images uploaded yet"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {search || folderFilter !== "all"
              ? "Try changing your search or folder filter"
              : "Upload your first image to get started"}
          </p>
          {!search && folderFilter === "all" && (
            <Button onClick={() => setUploadOpen(true)} className="mt-4">
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((img) => (
            <div
              key={img.path}
              className="group relative overflow-hidden rounded-lg border border-border/60 bg-background"
            >
              {/* Image preview */}
              <div className="relative aspect-square bg-muted">
                <img
                  src={img.url}
                  alt={img.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => setPreviewImage(img)}
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => copyUrl(img.url)}
                    title="Copy URL"
                  >
                    {copiedUrl === img.url ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 hover:bg-red-500 hover:text-white"
                    onClick={() => setDeleteTarget(img)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Folder badge */}
                <div className="absolute left-2 top-2">
                  <Badge variant="secondary" className="bg-black/60 text-white">
                    {img.folder}
                  </Badge>
                </div>
              </div>

              {/* Image info */}
              <div className="p-2">
                <p className="truncate text-xs font-medium" title={img.name}>
                  {img.name}
                </p>
                <div className="mt-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{formatSize(img.size)}</span>
                  <span>{formatDate(img.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload dialog */}
      {uploadOpen && (
        <UploadDialog
          onClose={() => setUploadOpen(false)}
          onUploaded={() => {
            setUploadOpen(false);
            fetchImages();
          }}
        />
      )}

      {/* Preview dialog */}
      {previewImage && (
        <Dialog open onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="truncate">{previewImage.name}</DialogTitle>
            </DialogHeader>
            <div className="overflow-hidden rounded-lg bg-muted">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-h-[60vh] w-full object-contain"
              />
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium">Path:</span> {previewImage.path}</p>
              <p><span className="font-medium">Size:</span> {formatSize(previewImage.size)}</p>
              <p><span className="font-medium">Uploaded:</span> {formatDate(previewImage.created_at)}</p>
              <p className="break-all">
                <span className="font-medium">URL:</span>{" "}
                <span className="text-accent">{previewImage.url}</span>
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => copyUrl(previewImage.url)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy URL
              </Button>
              <Button variant="destructive" onClick={() => {
                setPreviewImage(null);
                setDeleteTarget(previewImage);
              }}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                Delete Image
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  <img
                    src={deleteTarget.url}
                    alt={deleteTarget.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{deleteTarget.name}</p>
                  <p className="text-xs text-muted-foreground">{deleteTarget.folder}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(deleteTarget.size)}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This will permanently delete the image from storage. If this image
                is used on your website (products, homepage, blog), it will no longer
                display. This action cannot be undone.
              </p>
            </div>
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

/**
 * Upload dialog component
 */
function UploadDialog({
  onClose,
  onUploaded,
}: {
  onClose: () => void;
  onUploaded: () => void;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [folder, setFolder] = React.useState("general");
  const [uploading, setUploading] = React.useState(false);
  const [preview, setPreview] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  }

  async function handleUpload() {
    if (!file) {
      toast.error("Please select an image");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Image uploaded successfully");
        onUploaded();
      } else {
        toast.error(data.error || "Failed to upload");
      }
    } catch {
      toast.error("Failed to upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Folder selection */}
          <div className="space-y-2">
            <Label htmlFor="folder">Folder</Label>
            <Input
              id="folder"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="e.g. hero, products, blog"
            />
            <p className="text-[10px] text-muted-foreground">
              Organize images into folders (e.g. hero, brand-story, products)
            </p>
          </div>

          {/* File input */}
          <div className="space-y-2">
            <Label>Image File *</Label>
            <div
              onClick={() => inputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-accent/40"
            >
              {preview ? (
                <div className="relative h-32 w-full overflow-hidden rounded-md">
                  <img src={preview} alt="Preview" className="h-full w-full object-contain" />
                </div>
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to select image</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG, WebP, GIF · Max 5MB
                  </p>
                </>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
            {file && (
              <p className="text-xs text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
