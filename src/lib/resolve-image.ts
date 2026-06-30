import "server-only";

import { existsSync } from "node:fs";
import { join } from "node:path";
import { IMAGE_PLACEHOLDER } from "@/lib/content";

const publicDir = join(process.cwd(), "public");
const cache = new Map<string, string>();

/**
 * Returns `src` if the file exists under /public, otherwise the shared SVG
 * placeholder. Lets us reference real photo filenames (e.g. hero-kit.jpg) up
 * front — the moment those files are dropped into /public/images they render,
 * no code change needed. Results are cached per path.
 */
export function resolveImage(src: string): string {
  const cached = cache.get(src);
  if (cached) return cached;

  const rel = src.startsWith("/") ? src.slice(1) : src;
  const resolved = existsSync(join(publicDir, rel)) ? src : IMAGE_PLACEHOLDER;
  cache.set(src, resolved);
  return resolved;
}
