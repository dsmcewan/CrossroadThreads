import type { NextConfig } from "next";

// Project site on GitHub Pages → served under /<repo>. Local dev serves at /.
const repo = "CrossroadThreads";
const isPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isPages ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
