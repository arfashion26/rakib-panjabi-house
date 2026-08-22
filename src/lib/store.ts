"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  discountPrice: number | null;
  quantity: number;
  selectedSize: string | null;
  selectedColor: string | null;
  sku: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  // Actions
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (
    productId: string,
    selectedSize?: string | null,
    selectedColor?: string | null
  ) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    selectedSize?: string | null,
    selectedColor?: string | null
  ) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  // Getters
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.selectedSize === item.selectedSize &&
              i.selectedColor === item.selectedColor
          );

          if (existingIndex >= 0) {
            // Update quantity of existing item
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems, isOpen: true };
          }

          return {
            items: [...state.items, { ...item, quantity }],
            isOpen: true,
          };
        }),

      removeItem: (productId, selectedSize, selectedColor) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.productId === productId &&
                i.selectedSize === selectedSize &&
                i.selectedColor === selectedColor
              )
          ),
        })),

      updateQuantity: (productId, quantity, selectedSize, selectedColor) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) =>
                  !(
                    i.productId === productId &&
                    i.selectedSize === selectedSize &&
                    i.selectedColor === selectedColor
                  )
              ),
            };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId &&
              i.selectedSize === selectedSize &&
              i.selectedColor === selectedColor
                ? { ...i, quantity }
                : i
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((total, item) => {
          const price = item.discountPrice ?? item.price;
          return total + price * item.quantity;
        }, 0),
    }),
    {
      name: "rph-cart",
      // Only persist items, not isOpen state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Wishlist store
interface WishlistState {
  productIds: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        })),
      has: (productId) => get().productIds.includes(productId),
      clear: () => set({ productIds: [] }),
    }),
    { name: "rph-wishlist" }
  )
);

// Compare store
interface CompareState {
  productIds: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
  MAX_ITEMS: number;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      productIds: [],
      MAX_ITEMS: 4,
      toggle: (productId) =>
        set((state) => {
          if (state.productIds.includes(productId)) {
            return {
              productIds: state.productIds.filter((id) => id !== productId),
            };
          }
          if (state.productIds.length >= state.MAX_ITEMS) {
            return state; // Don't add more than max
          }
          return { productIds: [...state.productIds, productId] };
        }),
      has: (productId) => get().productIds.includes(productId),
      clear: () => set({ productIds: [] }),
    }),
    { name: "rph-compare" }
  )
);

// Recently viewed store
interface RecentlyViewedState {
  productIds: string[];
  add: (productId: string) => void;
  clear: () => void;
}

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      productIds: [],
      add: (productId) =>
        set((state) => ({
          productIds: [
            productId,
            ...state.productIds.filter((id) => id !== productId),
          ].slice(0, 10), // Keep last 10
        })),
      clear: () => set({ productIds: [] }),
    }),
    { name: "rph-recently-viewed" }
  )
);
