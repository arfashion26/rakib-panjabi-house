"use client";

import Link from "next/link";
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const posts = [
  { id: "1", title: "The Art of Choosing the Perfect Panjabi", slug: "art-of-choosing-perfect-panjabi", category: "Style Guide", author: "Editor", status: "PUBLISHED", date: "Aug 15, 2026", views: 1245 },
  { id: "2", title: "5 Ways to Style a Sherwani for Wedding Season", slug: "styling-sherwani-wedding", category: "Fashion Tips", author: "Editor", status: "PUBLISHED", date: "Aug 8, 2026", views: 892 },
  { id: "3", title: "Caring for Your Premium Ethnic Wear", slug: "caring-premium-ethnic-wear", category: "Care Guide", author: "Editor", status: "PUBLISHED", date: "Aug 1, 2026", views: 567 },
  { id: "4", title: "Winter Fashion Trends 2026", slug: "winter-fashion-trends-2026", category: "Trends", author: "Editor", status: "DRAFT", date: "—", views: 0 },
];

export default function AdminBlogPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Blog Posts
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {posts.length} posts ({posts.filter((p) => p.status === "PUBLISHED").length} published)
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Views</th>
                <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/20">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">{post.title}</p>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{post.category}</td>
                  <td className="p-3 text-sm text-muted-foreground">{post.date}</td>
                  <td className="p-3 text-center text-sm">{post.views}</td>
                  <td className="p-3 text-center">
                    <Badge variant="secondary" className={post.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                      {post.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
