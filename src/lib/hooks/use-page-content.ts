"use client";

import * as React from "react";
import type { PageContent, PageSlug } from "@/lib/page-content-config";

/**
 * Hook to fetch admin-edited page content.
 *
 * Returns:
 * - content: the edited content (or null if not edited / still loading)
 * - loading: boolean
 *
 * The page should use its built-in default content when `content` is null
 * or when a specific field is empty.
 */
export function usePageContent(slug: PageSlug) {
  const [content, setContent] = React.useState<PageContent | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/page-content/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.success && data.content) {
          setContent(data.content);
        }
        if (!cancelled) setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { content, loading };
}

/**
 * Helper to pick the first non-empty value.
 * Falls back to the default if the edited value is empty.
 */
export function pickContent(edited: string | undefined, fallback: string): string {
  return edited && edited.trim() ? edited : fallback;
}
