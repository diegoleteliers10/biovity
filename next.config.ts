import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ['9757-2800-150-112-120a-9df2-e711-16ce-ee7c.ngrok-free.app'],
  experimental: {
    viewTransition: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ]
  },
}

export default nextConfig
