import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("about");
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
