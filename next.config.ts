import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que el bundler intente resolver empaquetado de `qrcode` (API routes / Turbopack).
  serverExternalPackages: ["qrcode"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dufmmwqtcoqrdismwugv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
