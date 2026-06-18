import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Wrapper around next/image for product/project imagery.
 *
 * Ships with lightweight local SVG placeholders so the page is fast and
 * self-contained. To use real photos, drop .jpg/.webp files in /public/images
 * and pass their `src` — next/image will auto-optimize (AVIF/WebP, responsive
 * srcset). SVG placeholders are served `unoptimized` (no raster pipeline).
 */
export function ProductImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
}) {
  const isSvg = src.endsWith(".svg");
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={isSvg}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
