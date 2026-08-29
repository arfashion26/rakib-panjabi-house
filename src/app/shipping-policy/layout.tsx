import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("shipping-policy");
}

export default function shipping_policyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
