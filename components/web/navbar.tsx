"use client";

import {
  Loader2,
  Menu,
  X,
  Home,
  BookOpen,
  PenSquare,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { SearchInput } from "./searchInput";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function handleSignOut() {
    startTransition(() => {
      authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            setMobileOpen(false);
            router.push("/");
          },
          onError: (error) => {
            toast.error(
              error?.error?.message ??
                error?.error?.statusText ??
                "Failed to sign out",
            );
          },
        },
      });
    });
  }

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/blog", label: "Blog", icon: BookOpen },
    ...(isAuthenticated
      ? [{ href: "/create", label: "Create", icon: PenSquare }]
      : []),
  ];

  return (
    <nav className="w-full py-4 border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <h1 className="text-2xl font-bold">
            Ab_<span className="text-violet-500">Dev</span>
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === link.href &&
                  "bg-accent text-accent-foreground font-medium",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <SearchInput />

          {isLoading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : isAuthenticated ? (
            <Button
              className="bg-violet-600 hover:bg-violet-700"
              disabled={isPending}
              onClick={handleSignOut}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Signing out...</span>
                </>
              ) : (
                <span>Logout</span>
              )}
            </Button>
          ) : (
            <>
              <Link className={buttonVariants()} href="/auth/sign-up">
                Sign up
              </Link>
              <Link
                className={buttonVariants({ variant: "secondary" })}
                href="/auth/login"
              >
                Login
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-border/40 flex flex-col gap-1 pt-4">
          {/* Mobile search */}
          <div className="mb-3">
            <SearchInput />
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === link.href && "bg-accent text-accent-foreground",
              )}
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          ))}

          <div className="mt-2 flex flex-col gap-2">
            {isLoading ? (
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading...
              </div>
            ) : isAuthenticated ? (
              <button
                onClick={handleSignOut}
                disabled={isPending}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LogOut className="size-4" />
                )}
                {isPending ? "Signing out..." : "Logout"}
              </button>
            ) : (
              <>
                <Link
                  href="/auth/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                >
                  <UserPlus className="size-4" />
                  Sign up
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <LogIn className="size-4" />
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
