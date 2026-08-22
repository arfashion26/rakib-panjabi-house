"use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { placeholderCategories } from "@/lib/placeholder-data";

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Categories
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {placeholderCategories.length} categories
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug</th>
                <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order</th>
                <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Featured</th>
                <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {placeholderCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/20">
                  <td className="p-3 text-sm font-medium">{cat.name}</td>
                  <td className="p-3 text-sm text-muted-foreground">{cat.slug}</td>
                  <td className="p-3 text-center text-sm">{cat.order}</td>
                  <td className="p-3 text-center">
                    {cat.is_featured && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        Featured
                      </Badge>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
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
