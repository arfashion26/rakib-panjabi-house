import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("gift-cards");
}

export default function gift_cardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
