import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { components } from "../_generated/api";
import type { DataModel } from "../_generated/dataModel";
import authConfig from "../auth.config";
import schema from "./schema";

// Better Auth Component
export const authComponent = createClient<DataModel, typeof schema>(
  components.betterAuth,
  {
    local: { schema },
    verbose: false,
  },
);

// Better Auth Options — called at request time, not module load time
export const createAuthOptions = (
  ctx: GenericCtx<DataModel>,
): BetterAuthOptions => {
  const siteUrl =
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const secret =
    process.env.BETTER_AUTH_SECRET ??
    process.env.AUTH_SECRET ??
    "default-secret-replace-me";

  return {
    appName: "My App",
    baseURL: siteUrl,
    secret: secret,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: [
      siteUrl,
      ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
        .map((o) => o.trim())
        .filter(Boolean) ?? []),
    ],
    plugins: [convex({ authConfig })],
  };
};

// For `auth` CLI — called lazily so it never runs at module load time
let _options: BetterAuthOptions | undefined;
export const options: BetterAuthOptions = new Proxy({} as BetterAuthOptions, {
  get(_target, prop: string) {
    if (!_options) {
      _options = createAuthOptions({} as GenericCtx<DataModel>);
    }
    return (_options as Record<string, unknown>)[prop];
  },
});

// Better Auth Instance
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};
