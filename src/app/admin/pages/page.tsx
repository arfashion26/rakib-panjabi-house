"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Loader2,
  Save,
  Eye,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PAGE_SLUGS, PAGE_INFO, type PageSlug } from "@/lib/page-content-config";

interface PageListItem {
  slug: string;
  isEdited: boolean;
  heroTitle: string;
  updatedAt: string | null;
}

export default function AdminPagesPage() {
  const [selectedSlug, setSelectedSlug] = React.useState<PageSlug | null>(null);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
          Page Content Manager
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Edit hero titles, descriptions, and body content for each page.
          Changes go live immediately.
        </p>
      </div>

      {selectedSlug ? (
        <PageEditor slug={selectedSlug} onBack={() => setSelectedSlug(null)} />
      ) : (
        <PageList onSelect={setSelectedSlug} />
      )}
    </div>
  );
}

/**
 * List of all pages with edit status.
 */
function PageList({ onSelect }: { onSelect: (slug: PageSlug) => void }) {
  const [pages, setPages] = React.useState<PageListItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    fetch("/api/admin/page-content")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setPages(data.pages);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = PAGE_SLUGS.filter((slug) =>
    slug.toLowerCase().includes(search.toLowerCase()) ||
    PAGE_INFO[slug].title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Grid of pages */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((slug) => {
          const info = PAGE_INFO[slug];
          const pageData = pages.find((p) => p.slug === slug);
          const isEdited = pageData?.isEdited;

          return (
            <button
              key={slug}
              onClick={() => onSelect(slug)}
              className="group flex flex-col rounded-xl border border-border/60 bg-background p-4 text-left transition-all hover:border-accent/40 hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <FileText className="h-4 w-4" />
                </div>
                {isEdited ? (
                  <Badge className="bg-green-100 text-green-700">Custom</Badge>
                ) : (
                  <Badge variant="secondary">Default</Badge>
                )}
              </div>
              <p className="text-sm font-semibold">{info.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{info.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-accent opacity-0 transition-opacity group-hover:opacity-100">
                <Eye className="h-3 w-3" />
                Edit content
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">No pages match your search</p>
        </div>
      )}
    </div>
  );
}

/**
 * Editor for a single page's content.
 */
function PageEditor({ slug, onBack }: { slug: PageSlug; onBack: () => void }) {
  const info = PAGE_INFO[slug];
  const [content, setContent] = React.useState({
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    heroEyebrow: "",
    bodyContent: "",
    metaTitle: "",
    metaDescription: "",
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/admin/page-content/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.content) {
          setContent(data.content);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  function update<K extends keyof typeof content>(key: K, value: string) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/page-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ...content }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Page content saved — changes are live");
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isPolicyPage = ["privacy-policy", "terms", "return-policy", "shipping-policy", "size-guide"].includes(slug);

  return (
    <div>
      {/* Back button + title */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="font-serif text-xl font-medium">{info.title}</h2>
            <p className="text-xs text-muted-foreground">{info.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              View Page
            </Link>
          </Button>
          <Button onClick={save} disabled={saving} size="sm">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save & Deploy
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Info banner */}
        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <p className="text-xs text-blue-800">
            <strong>How it works:</strong> Fill in the fields below to override the
            default content. Leave a field blank to use the built-in default. Changes
            appear on the live site immediately after saving.
          </p>
        </div>

        {/* Hero Section */}
        <div className="rounded-lg border border-border/60 bg-background p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Hero Section
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroEyebrow">Eyebrow (small label above title)</Label>
              <Input
                id="heroEyebrow"
                placeholder="e.g. Our Story"
                value={content.heroEyebrow}
                onChange={(e) => update("heroEyebrow", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Title</Label>
              <Input
                id="heroTitle"
                placeholder="Main page heading"
                value={content.heroTitle}
                onChange={(e) => update("heroTitle", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Subtitle</Label>
              <Input
                id="heroSubtitle"
                placeholder="Secondary heading or tagline"
                value={content.heroSubtitle}
                onChange={(e) => update("heroSubtitle", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroDescription">Description</Label>
              <Textarea
                id="heroDescription"
                placeholder="Paragraph text shown below the title"
                value={content.heroDescription}
                onChange={(e) => update("heroDescription", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Body Content (for policy pages) */}
        {isPolicyPage && (
          <div className="rounded-lg border border-border/60 bg-background p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Body Content
            </h3>
            <p className="mb-3 text-xs text-muted-foreground">
              Full page content. You can use basic HTML tags (&lt;h2&gt;, &lt;p&gt;,
              &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;) for formatting.
            </p>
            <Textarea
              placeholder="<h2>Section Title</h2><p>Paragraph text...</p>"
              value={content.bodyContent}
              onChange={(e) => update("bodyContent", e.target.value)}
              rows={12}
              className="font-mono text-xs"
            />
          </div>
        )}

        {/* SEO Section */}
        <div className="rounded-lg border border-border/60 bg-background p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            SEO Settings
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                placeholder="SEO title for search engines"
                value={content.metaTitle}
                onChange={(e) => update("metaTitle", e.target.value)}
                maxLength={70}
              />
              <p className="text-[10px] text-muted-foreground">
                {content.metaTitle.length}/70 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                placeholder="SEO description for search engines"
                value={content.metaDescription}
                onChange={(e) => update("metaDescription", e.target.value)}
                rows={2}
                maxLength={160}
              />
              <p className="text-[10px] text-muted-foreground">
                {content.metaDescription.length}/160 characters
              </p>
            </div>
          </div>
        </div>

        {/* Save button (bottom) */}
        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save & Deploy
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
