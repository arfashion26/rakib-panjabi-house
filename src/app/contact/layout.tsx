import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("contact");
}

export default function contactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
