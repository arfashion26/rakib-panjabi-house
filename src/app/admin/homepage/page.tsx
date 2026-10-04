"use client";

import * as React from "react";
import { Save, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/admin/image-upload";
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
    image: string;
    badgeText: string;
  };
  heroSlides?: Array<{
    id: string;
    image: string;
    mobileImage: string;
    title: string;
    subtitle: string;
    link: string;
    buttonText: string;
    align: string;
  }>;
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
    image: string;
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
  instagram: {
    image1: string;
    image2: string;
    image3: string;
    image4: string;
    image5: string;
    image6: string;
  };
}

export default function AdminHomepagePage() {
  const [content, setContent] = React.useState<HomepageContent | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    async function fetchContent() {
      try {
        // Cache-busting: add timestamp so we always get fresh data
        const res = await fetch(`/api/admin/homepage?_t=${Date.now()}`);
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
        // Purge the homepage ISR cache so changes appear immediately
        // (homepage is cached for 24h via revalidate=86400)
        try {
          await fetch("/api/revalidate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paths: ["/", "/shop"] }),
          });
        } catch {
          // Revalidation is best-effort — don't block save on failure
        }
        toast.success("Homepage content saved — changes are live!");
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

        {/* Hero Slider Slides */}
        {sectionWrapper("🖼️ Hero Slider Slides", (
          <>
            <p className="text-xs text-muted-foreground">
              Upload a single banner image per slide. It will automatically
              adapt to all screen sizes (desktop, tablet, mobile). Recommended
              size: 1920×960px (2:1 ratio). Add optional title, subtitle, and
              a call-to-action button.
            </p>
            {(content.heroSlides || []).map((slide, idx) => (
              <div key={slide.id || idx} className="rounded-md border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Slide {idx + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => {
                      if (!confirm("Delete this slide?")) return;
                      const slides = [...(content.heroSlides || [])];
                      slides.splice(idx, 1);
                      setContent({ ...content, heroSlides: slides });
                    }}
                  >
                    Delete
                  </Button>
                </div>
                {/* Single image — responsive, works on all devices */}
                <ImageUpload
                  label="Banner Image"
                  value={slide.image || ""}
                  onChange={(v) => {
                    const slides = [...(content.heroSlides || [])];
                    slides[idx] = { ...slides[idx], image: v, mobileImage: v };
                    setContent({ ...content, heroSlides: slides });
                  }}
                  folder="hero"
                  aspectRatio="aspect-[2/1]"
                  hint="Recommended: 1920×960px (2:1 ratio). Same image on all devices."
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title (optional)</Label>
                    <Input
                      value={slide.title || ""}
                      onChange={(e) => {
                        const slides = [...(content.heroSlides || [])];
                        slides[idx] = { ...slides[idx], title: e.target.value };
                        setContent({ ...content, heroSlides: slides });
                      }}
                      placeholder="e.g. Premium Panjabi Collection"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle (optional)</Label>
                    <Input
                      value={slide.subtitle || ""}
                      onChange={(e) => {
                        const slides = [...(content.heroSlides || [])];
                        slides[idx] = { ...slides[idx], subtitle: e.target.value };
                        setContent({ ...content, heroSlides: slides });
                      }}
                      placeholder="e.g. Timeless elegance"
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Button Text (optional)</Label>
                    <Input
                      value={slide.buttonText || ""}
                      onChange={(e) => {
                        const slides = [...(content.heroSlides || [])];
                        slides[idx] = { ...slides[idx], buttonText: e.target.value };
                        setContent({ ...content, heroSlides: slides });
                      }}
                      placeholder="e.g. Shop Now"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link (URL)</Label>
                    <Input
                      value={slide.link || ""}
                      onChange={(e) => {
                        const slides = [...(content.heroSlides || [])];
                        slides[idx] = { ...slides[idx], link: e.target.value };
                        setContent({ ...content, heroSlides: slides });
                      }}
                      placeholder="/shop/panjabi-collection"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                const slides = [...(content.heroSlides || [])];
                slides.push({
                  id: `slide-${Date.now()}`,
                  image: "",
                  mobileImage: "",
                  title: "",
                  subtitle: "",
                  link: "/shop",
                  buttonText: "Shop Now",
                  align: "left",
                });
                setContent({ ...content, heroSlides: slides });
              }}
            >
              + Add Slide
            </Button>
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
            <Separator />
            <p className="text-sm font-semibold">Images</p>
            <ImageUpload
              label="Brand Story Image (left side)"
              value={content.brandStory.image || ""}
              onChange={(v) => updateSection("brandStory", "image", v)}
              folder="brand-story"
              aspectRatio="aspect-square"
              hint="Recommended: 600×600px (square)"
            />
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

        {/* Instagram Feed Images */}
        {sectionWrapper("📸 Instagram Feed Images", (
          <>
            <p className="text-xs text-muted-foreground">Upload images for the Instagram feed section on homepage. If empty, placeholder gradient will be shown.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <ImageUpload label="Image 1" value={content.instagram?.image1 || ""} onChange={(v) => updateSection("instagram", "image1", v)} folder="instagram" aspectRatio="aspect-square" />
              <ImageUpload label="Image 2" value={content.instagram?.image2 || ""} onChange={(v) => updateSection("instagram", "image2", v)} folder="instagram" aspectRatio="aspect-square" />
              <ImageUpload label="Image 3" value={content.instagram?.image3 || ""} onChange={(v) => updateSection("instagram", "image3", v)} folder="instagram" aspectRatio="aspect-square" />
              <ImageUpload label="Image 4" value={content.instagram?.image4 || ""} onChange={(v) => updateSection("instagram", "image4", v)} folder="instagram" aspectRatio="aspect-square" />
              <ImageUpload label="Image 5" value={content.instagram?.image5 || ""} onChange={(v) => updateSection("instagram", "image5", v)} folder="instagram" aspectRatio="aspect-square" />
              <ImageUpload label="Image 6" value={content.instagram?.image6 || ""} onChange={(v) => updateSection("instagram", "image6", v)} folder="instagram" aspectRatio="aspect-square" />
            </div>
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
