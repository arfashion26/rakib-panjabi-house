import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Header with centered logo */}
      <header className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-md px-4 py-6">
          <Link href="/" className="flex justify-center">
            <Logo size="md" />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-background py-6">
        <div className="mx-auto max-w-md px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Rakib Panjabi House. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
