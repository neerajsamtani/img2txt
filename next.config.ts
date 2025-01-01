import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [], // Add any image domains you need here
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Set this to your desired limit, e.g., '10mb', '50mb', etc.
    },
    responseLimit: false,
  }
}

export default nextConfig;
