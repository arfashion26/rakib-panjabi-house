"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } =
    useCart();
  const subtotal = getSubtotal();
  const FREE_SHIPPING_THRESHOLD = 2000;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="space-y-0">
          <SheetTitle className="flex items-center justify-between text-left">
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Cart ({items.length})
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Your cart is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add some products to get started
              </p>
            </div>
            <Button asChild onClick={closeCart}>
              <Link href="/shop">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-4 rounded-lg bg-muted/50 p-3">
              {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                <p className="text-center text-xs font-medium text-accent">
                  ✓ You qualify for FREE shipping!
                </p>
              ) : (
                <>
                  <p className="mb-2 text-center text-xs text-muted-foreground">
                    Add{" "}
                    <span className="font-semibold text-foreground">
                      {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}
                    </span>{" "}
                    more for FREE shipping
                  </p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{
                        width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 flex-1 space-y-3 overflow-y-auto scrollbar-elegant">
              {items.map((item, idx) => {
                const key = `${item.productId}-${item.selectedSize}-${item.selectedColor}-${idx}`;
                const itemPrice = item.discountPrice ?? item.price;
                return (
                  <div key={key} className="flex gap-3 rounded-lg border border-border/60 p-3">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted"
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-serif text-xl font-light text-muted-foreground/40">RPH</span>
                        </div>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="line-clamp-2 text-sm font-medium hover:text-accent"
                      >
                        {item.name}
                      </Link>

                      {(item.selectedSize || item.selectedColor) && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && " · "}
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1, item.selectedSize, item.selectedColor)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1, item.selectedSize, item.selectedColor)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{formatPrice(itemPrice * item.quantity)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-red-500"
                            onClick={() => removeItem(item.productId, item.selectedSize, item.selectedColor)}
                            aria-label="Remove from cart"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 space-y-3 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-serif text-lg font-medium">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout</p>
              <Separator />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={closeCart} asChild>
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button className="flex-1" asChild onClick={closeCart}>
                  <Link href="/checkout">
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
