import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("faq");
}

export default function faqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
