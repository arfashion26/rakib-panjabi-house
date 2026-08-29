import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("blog");
}

export default function blogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
