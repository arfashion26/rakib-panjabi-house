"use client";

import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const banners = [
  { id: "1", title: "Autumn Collection 2026", position: "HOMEPAGE_HERO", order: 1, status: "ACTIVE", clicks: 1245 },
  { id: "2", title: "Flash Sale — 40% Off", position: "HOMEPAGE_PROMO", order: 1, status: "ACTIVE", clicks: 892 },
  { id: "3", title: "Premium Collection", position: "HOMEPAGE_FEATURED", order: 1, status: "ACTIVE", clicks: 567 },
  { id: "4", title: "Eid Special Offer", position: "ANNOUNCEMENT", order: 1, status: "INACTIVE", clicks: 0 },
];

export default function AdminBannersPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Banners
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {banners.length} banners ({banners.filter((b) => b.status === "ACTIVE").length} active)
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Banner
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="overflow-hidden rounded-lg border border-border/60 bg-background"
          >
            {/* Banner preview */}
            <div
              className="relative flex h-32 items-center justify-center bg-gradient-to-br from-primary to-primary/80"
            >
              <div className="text-center text-primary-foreground">
                <ImageIcon className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p className="text-xs opacity-70">{banner.title}</p>
              </div>
              <Badge
                variant="secondary"
                className={`absolute right-2 top-2 ${banner.status === "ACTIVE" ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                {banner.status}
              </Badge>
            </div>

            {/* Banner info */}
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">{banner.title}</h3>
                <span className="text-xs text-muted-foreground">#{banner.order}</span>
              </div>
              <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span>Position: {banner.position}</span>
                <span>•</span>
                <span>Clicks: {banner.clicks}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
