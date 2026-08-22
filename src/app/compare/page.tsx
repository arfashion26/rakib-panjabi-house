"use client";

import * as React from "react";
import Link from "next/link";
import { GitCompare, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCompare } from "@/lib/store";
import { useCart } from "@/lib/store";
import { getProducts } from "@/lib/services/products";
import { Container, ButtonLink } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { formatPrice, calculateDiscount } from "@/lib/types";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  discount_price: number | null;
  fabric?: string | null;
  fit?: string | null;
  care?: string | null;
  origin?: string | null;
  weight_kg?: number | null;
  sizes?: { size: string; stock: number }[];
  colors?: { name: string; hex_value: string }[];
  images?: { url: string; is_primary: boolean }[];
}

export default function ComparePage() {
  const productIds = useCompare((s) => s.productIds);
  const toggle = useCompare((s) => s.toggle);
  const clearCompare = useCompare((s) => s.clear);
  const addItem = useCart((s) => s.addItem);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProducts() {
      if (productIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { products: fetched } = await getProducts({ limit: 100 });
        const filtered = fetched.filter((p) => productIds.includes(p.id));
        setProducts(filtered);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [productIds]);

  if (loading) {
    return (
      <Container className="py-16">
        <div className="text-center">Loading comparison...</div>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container className="py-16">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6 py-16 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <GitCompare className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium">Nothing to Compare</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Add products to compare their features side by side. You can compare up to 4 products at once.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/shop">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  const specs = [
    { key: "price", label: "Price" },
    { key: "discount_price", label: "Discount Price" },
    { key: "fabric", label: "Fabric" },
    { key: "fit", label: "Fit" },
    { key: "care", label: "Care" },
    { key: "origin", label: "Origin" },
    { key: "weight_kg", label: "Weight (kg)" },
    { key: "sizes", label: "Available Sizes" },
    { key: "colors", label: "Available Colors" },
  ];

  return (
    <Container className="py-8">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">Compare</span>
      </nav>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">Compare Products</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Comparing {products.length} of 4 products
          </p>
        </div>
        <Button variant="ghost" onClick={clearCompare} className="text-muted-foreground hover:text-red-500">
          <X className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="w-40 border-b border-border p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
              {products.map((product) => (
                <th key={product.id} className="border-b border-border p-4 text-center align-top">
                  <div className="relative">
                    <button onClick={() => toggle(product.id)} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-red-500 hover:text-white" aria-label="Remove from compare">
                      <X className="h-3 w-3" />
                    </button>
                    <Link href={`/product/${product.slug}`} className="block aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-serif text-3xl font-light text-muted-foreground/40">RPH</span>
                        </div>
                      )}
                    </Link>
                    <Link href={`/product/${product.slug}`} className="mt-2 line-clamp-2 block text-sm font-medium hover:text-accent">
                      {product.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map((spec) => (
              <tr key={spec.key} className="border-b border-border/60">
                <td className="bg-muted/30 p-4 text-sm font-medium">{spec.label}</td>
                {products.map((product) => {
                  const value = (product as any)[spec.key];
                  return (
                    <td key={product.id} className="p-4 text-center text-sm">
                      {spec.key === "price" || spec.key === "discount_price"
                        ? value ? formatPrice(value as number) : "—"
                        : spec.key === "sizes"
                        ? (product.sizes && product.sizes.length > 0) ? product.sizes.map((s) => s.size).join(", ") : "—"
                        : spec.key === "colors"
                        ? (product.colors && product.colors.length > 0) ? product.colors.map((c) => c.name).join(", ") : "—"
                        : value ? String(value) : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="bg-muted/30 p-4 text-sm font-medium">Actions</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <Button
                    size="sm"
                    onClick={() => {
                      addItem({
                        productId: product.id,
                        slug: product.slug,
                        name: product.name,
                        image: product.images?.[0]?.url || null,
                        price: product.price,
                        discountPrice: product.discount_price ?? null,
                        sku: product.sku,
                        selectedSize: null,
                        selectedColor: null,
                      });
                      toast.success("Added to cart");
                    }}
                  >
                    <ShoppingBag className="mr-1 h-3.5 w-3.5" />
                    Add to Cart
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
}
