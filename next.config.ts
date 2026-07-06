import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

function getDevOrigins() {
  const localNetworkHosts = Object.values(networkInterfaces())
    .flatMap((addresses) => addresses ?? [])
    .filter((address) => address.family === "IPv4" && !address.internal)
    .map((address) => address.address);

  return Array.from(new Set(["127.0.0.1", "0.0.0.0", ...localNetworkHosts]));
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getDevOrigins(),
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
  },
};

export default nextConfig;