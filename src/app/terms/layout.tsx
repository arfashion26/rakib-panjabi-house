import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("terms");
}

export default function termsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
