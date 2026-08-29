import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("size-guide");
}

export default function size_guideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
