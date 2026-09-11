/** Stamped at build time via next.config.ts `env`. Shown in the debug console. */
export interface BuildInfo {
  version: string;
  commit: string;
  builtAt: string;
  next: string;
  node: string;
  region: string;
}

export function buildInfo(): BuildInfo {
  return {
    version: process.env.NEXT_PUBLIC_SITE_VERSION ?? "dev",
    commit: process.env.NEXT_PUBLIC_COMMIT ?? "local",
    builtAt: process.env.NEXT_PUBLIC_BUILT_AT ?? "",
    next: process.env.NEXT_PUBLIC_NEXT_VERSION ?? "",
    node: process.env.NEXT_PUBLIC_NODE_VERSION ?? "",
    region: process.env.NEXT_PUBLIC_REGION ?? "local",
  };
}
