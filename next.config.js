/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverActions: {
      allowedForwardedHosts: ["pds8w8w2-3000.euw.devtunnels.ms"],
      allowedOrigins: ["*"],
      bodySizeLimit: "10mb",
    },
  },
  images: {
    domains: ["images.unsplash.com", "axdfmmwtobzrqbdcikrt.supabase.co","127.0.0.1"],
    unoptimized: true,
  },
};

export default config;
