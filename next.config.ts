import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as the fallback: the hero photograph is the LCP element
    // on every project page, so its transfer size matters more than anything
    // else on the site.
    formats: ["image/avif", "image/webp"],
    // Matches the layout's actual breakpoints rather than the defaults, so we
    // do not generate variants no `sizes` attribute will ever request.
    deviceSizes: [375, 430, 640, 768, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [16, 32, 64, 96, 128, 256, 384, 512],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
