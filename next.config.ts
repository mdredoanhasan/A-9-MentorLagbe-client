import type { NextConfig } from "next";

const nextConfig: NextConfig = {
async rewrites() {
  return [
    {
      source: "/api/:path((?!auth/).*)",
      destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
    },
  ];
},
  async redirects() {
    return [
      {
        source: "/dashboard/mentor/:path*",
        destination: "/dashboard/tutor/:path*",
        permanent: true,
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;