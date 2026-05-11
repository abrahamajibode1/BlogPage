import { Navbar } from "@/components/web/navbar";
import { Suspense } from "react";

export default function SharedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
      </Suspense>
      {children}
    </>
  );
}

function NavbarSkeleton() {
  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
      <div className="flex items-center gap-4">
        <div className="h-8 w-16 rounded-md bg-muted animate-pulse" />
        <div className="h-8 w-16 rounded-md bg-muted animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
        <div className="h-8 w-16 rounded-md bg-muted animate-pulse" />
      </div>
    </nav>
  );
}
