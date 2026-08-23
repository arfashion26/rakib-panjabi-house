"use client";

import * as React from "react";
import { Save, Loader2, RotateCcw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";

interface HomepageContent {
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
  };
  premiumCta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  brandStory: {
    eyebrow: string;
    title: string;
    description: string;
    description2: string;
    description3: string;
  };
  reviewsSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  announcement: {
    text: string;
    enabled: boolean;
  };
  newsletter: {
    title: string;
    description: string;
  };
}

export default function AdminHomepagePage() {
  const [content, setContent] = React.useState<HomepageContent | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/admin/homepage");
        const data = await res.json();
        if (data.success) {
          setContent(data.content);
        }
      } catch {
        toast.error("Failed to load homepage content");
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  function updateSection<K extends keyof HomepageContent>(
    section: K,
    field: string,
    value: string | boolean
  ) {
    setContent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: { ...prev[section], [field]: value },
      };
    });
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Homepage content saved successfully!");
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save homepage content");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !content) {
    return (
      <div className="py-16 text-center">
        <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading homepage content...</p>
      </div>
    );
  }

  const sectionWrapper = (title: string, children: React.ReactNode) => (
    <div className="rounded-lg border border-border/60 bg-background p-6">
      <h2 className="mb-4 font-serif text-lg font-medium">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    type: "input" | "textarea" = "input",
    placeholder?: string
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {type === "input" ? (
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} />
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Homepage Content
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Edit the content of your homepage sections
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Announcement Bar */}
        {sectionWrapper("📢 Announcement Bar", (
          <>
            {field("Announcement Text", content.announcement.text, (v) => updateSection("announcement", "text", v))}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={content.announcement.enabled}
                onChange={(e) => updateSection("announcement", "enabled", e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Show announcement bar
            </label>
          </>
        ))}

        {/* Hero Section */}
        {sectionWrapper("🎯 Hero Banner", (
          <>
            {field("Eyebrow Text", content.hero.eyebrow, (v) => updateSection("hero", "eyebrow", v), "input", "e.g. New Autumn Collection 2026")}
            <div className="grid gap-4 sm:grid-cols-2">
              {field("Title (Part 1)", content.hero.title, (v) => updateSection("hero", "title", v))}
              {field("Title (Accent Part)", content.hero.titleAccent, (v) => updateSection("hero", "titleAccent", v))}
            </div>
            {field("Description", content.hero.description, (v) => updateSection("hero", "description", v), "textarea")}
            <Separator />
            <p className="text-sm font-semibold">Buttons</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("Primary Button Text", content.hero.primaryCtaText, (v) => updateSection("hero", "primaryCtaText", v))}
              {field("Primary Button Link", content.hero.primaryCtaLink, (v) => updateSection("hero", "primaryCtaLink", v))}
              {field("Secondary Button Text", content.hero.secondaryCtaText, (v) => updateSection("hero", "secondaryCtaText", v))}
              {field("Secondary Button Link", content.hero.secondaryCtaLink, (v) => updateSection("hero", "secondaryCtaLink", v))}
            </div>
            <Separator />
            <p className="text-sm font-semibold">Statistics</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {field("Stat 1 Value", content.hero.stat1Value, (v) => updateSection("hero", "stat1Value", v))}
              {field("Stat 1 Label", content.hero.stat1Label, (v) => updateSection("hero", "stat1Label", v))}
              {field("Stat 2 Value", content.hero.stat2Value, (v) => updateSection("hero", "stat2Value", v))}
              {field("Stat 2 Label", content.hero.stat2Label, (v) => updateSection("hero", "stat2Label", v))}
              {field("Stat 3 Value", content.hero.stat3Value, (v) => updateSection("hero", "stat3Value", v))}
              {field("Stat 3 Label", content.hero.stat3Label, (v) => updateSection("hero", "stat3Label", v))}
            </div>
          </>
        ))}

        {/* Premium CTA */}
        {sectionWrapper("✨ Premium Collection CTA", (
          <>
            {field("Eyebrow", content.premiumCta.eyebrow, (v) => updateSection("premiumCta", "eyebrow", v))}
            {field("Title", content.premiumCta.title, (v) => updateSection("premiumCta", "title", v))}
            {field("Description", content.premiumCta.description, (v) => updateSection("premiumCta", "description", v), "textarea")}
            <div className="grid gap-4 sm:grid-cols-2">
              {field("Primary Button Text", content.premiumCta.primaryCtaText, (v) => updateSection("premiumCta", "primaryCtaText", v))}
              {field("Primary Button Link", content.premiumCta.primaryCtaLink, (v) => updateSection("premiumCta", "primaryCtaLink", v))}
              {field("Secondary Button Text", content.premiumCta.secondaryCtaText, (v) => updateSection("premiumCta", "secondaryCtaText", v))}
              {field("Secondary Button Link", content.premiumCta.secondaryCtaLink, (v) => updateSection("premiumCta", "secondaryCtaLink", v))}
            </div>
          </>
        ))}

        {/* Brand Story */}
        {sectionWrapper("📖 Brand Story", (
          <>
            {field("Eyebrow", content.brandStory.eyebrow, (v) => updateSection("brandStory", "eyebrow", v))}
            {field("Title", content.brandStory.title, (v) => updateSection("brandStory", "title", v))}
            {field("Paragraph 1", content.brandStory.description, (v) => updateSection("brandStory", "description", v), "textarea")}
            {field("Paragraph 2", content.brandStory.description2, (v) => updateSection("brandStory", "description2", v), "textarea")}
            {field("Paragraph 3", content.brandStory.description3, (v) => updateSection("brandStory", "description3", v), "textarea")}
          </>
        ))}

        {/* Reviews Section */}
        {sectionWrapper("⭐ Customer Reviews Section", (
          <>
            {field("Eyebrow", content.reviewsSection.eyebrow, (v) => updateSection("reviewsSection", "eyebrow", v))}
            {field("Title", content.reviewsSection.title, (v) => updateSection("reviewsSection", "title", v))}
            {field("Subtitle", content.reviewsSection.subtitle, (v) => updateSection("reviewsSection", "subtitle", v), "textarea")}
          </>
        ))}

        {/* Newsletter */}
        {sectionWrapper("📧 Newsletter Section", (
          <>
            {field("Title", content.newsletter.title, (v) => updateSection("newsletter", "title", v))}
            {field("Description", content.newsletter.description, (v) => updateSection("newsletter", "description", v), "textarea")}
          </>
        ))}

        {/* Save button at bottom */}
        <div className="flex justify-end gap-2 pb-8">
          <Button variant="outline" asChild>
            <Link href="/" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Preview Homepage
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
