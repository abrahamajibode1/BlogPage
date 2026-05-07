"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { convex } from "@/lib/convex";

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <ConvexBetterAuthProvider
      client={convex}
      authClient={authClient}
    >
      {children}
    </ConvexBetterAuthProvider>
  );
}
