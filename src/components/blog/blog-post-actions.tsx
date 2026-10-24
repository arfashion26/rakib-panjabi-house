"use client";

import * as React from "react";
import { Share2, Heart, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BlogPostActionsProps {
  title: string;
  backLabel: string;
  shareLabel: string;
  saveLabel: string;
  shareArticleLabel: string;
  shopCollectionLabel: string;
  enjoyedTitle: string;
  enjoyedDesc: string;
}

/**
 * Client-side actions for the blog post detail page.
 * Handles Share / Save button clicks using browser APIs + toast feedback.
 */
export function BlogPostActions({
  title,
  backLabel,
  shareLabel,
  saveLabel,
  shareArticleLabel,
  shopCollectionLabel,
  enjoyedTitle,
  enjoyedDesc,
}: BlogPostActionsProps) {
  const [saved, setSaved] = React.useState(false);

  function handleShare() {
    if (navigator.share) {
      navigator
        .share({ title, url: window.location.href })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  }

  function handleSave() {
    setSaved((s) => !s);
    toast.success(saved ? "Removed from saved" : "Article saved");
  }

  return (
    <>
      {/* Back link */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-accent-text"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        {backLabel}
      </Link>

      {/* Actions */}
      <div className="mb-8 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="mr-1.5 h-3.5 w-3.5" />
          {shareLabel}
        </Button>
        <Button
          variant={saved ? "default" : "outline"}
          size="sm"
          onClick={handleSave}
        >
          <Heart
            className={`mr-1.5 h-3.5 w-3.5 ${saved ? "fill-current" : ""}`}
          />
          {saveLabel}
        </Button>
      </div>

      {/* Share CTA */}
      <div className="mt-12 rounded-lg bg-muted/30 p-6 text-center">
        <p className="font-serif text-lg font-medium">{enjoyedTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{enjoyedDesc}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button onClick={handleShare} variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            {shareArticleLabel}
          </Button>
          <Button asChild>
            <Link href="/shop">
              {shopCollectionLabel}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
