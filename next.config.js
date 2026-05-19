/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repo = process.env.PAGES_BASE_PATH || ""; // 예: "/qa-agent" (GitHub Pages repo path), 비우면 root
module.exports = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? repo : "",
  assetPrefix: isProd ? repo : "",
};
