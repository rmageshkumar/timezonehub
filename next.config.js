/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    useTypeScriptCli: true,
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Production: disable React strict mode double-render in dev
  reactStrictMode: true,
  // Compress responses
  compress: true,
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
