"use client";

import * as React from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  aspectRatio?: string;
  hint?: string;
}

export function ImageUpload({
  label,
  value,
  onChange,
  folder = "general",
  aspectRatio = "aspect-video",
  hint,
}: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        onChange(data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-start gap-3">
        {/* Preview */}
        <div
          className={`relative ${aspectRatio} w-32 shrink-0 overflow-hidden rounded-lg border-2 border-border bg-muted`}
        >
          {value ? (
            <>
              <img
                src={value}
                alt={label}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-muted-foreground hover:text-red-500"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
            </div>
          )}
        </div>

        {/* Upload button */}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {value ? "Replace Image" : "Upload Image"}
              </>
            )}
          </Button>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          {value && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              URL: {value.substring(0, 60)}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
