import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("lookbook");
}

export default function lookbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
