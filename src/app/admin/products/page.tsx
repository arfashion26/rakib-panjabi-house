"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { placeholderProducts } from "@/lib/placeholder-data";
import { formatPrice } from "@/lib/types";

export default function AdminProductsPage() {
  const [search, setSearch] = React.useState("");

  const filtered = placeholderProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
            Products
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {placeholderProducts.length} products total
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Search + filters */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      {/* Products table */}
      <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
                <th className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="p-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-muted/20">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 shrink-0 rounded-md bg-muted"
                        style={{
                          background: `linear-gradient(135deg, ${product.images[0]}30, ${product.images[product.images.length - 1]}90)`,
                        }}
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-medium">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.brand_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {product.sku}
                  </td>
                  <td className="p-3 text-sm">{product.category_name}</td>
                  <td className="p-3 text-right text-sm font-medium">
                    {formatPrice(product.discount_price ?? product.price)}
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/product/${product.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/admin/products/${product.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm font-medium">No products found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
