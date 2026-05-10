"use client";

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { SearchInput } from "./searchInput";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            AB_<span className="text-violet-500">dev</span>
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === "/" && "bg-[#f0f0f0] p-2 rounded-sm",
          )}
          href="/"
        >
          Home
        </Link>
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === "/blog" && "bg-[#f0f0f0] p-2 rounded-sm",
          )}
          href="/blog"
        >
          Blog
        </Link>
        
        {isAuthenticated && (
          <Link
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === "/create" && "bg-[#f0f0f0] p-1 rounded-sm",
            )}
            href="/create"
          >
            Create
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:block mr-2">
          <SearchInput />
        </div>
        {isLoading ? (
          <span>Loading...</span>
        ) : isAuthenticated ? (
          <Button
            className="bg-violet-600"
            disabled={isPending}
            onClick={() =>
              startTransition(() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      toast.success("Logged out successfully");
                      router.push("/");
                    },
                    onError: (error) => {
                      toast.error(error.error.message);
                    },
                  },
                });
              })
            }
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
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
    </nav>
  );
}
