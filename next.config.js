/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // During development builds some lint rules are strict; ignore lint during build here
  eslint: {
    ignoreDuringBuilds: true,
  },
}
module.exports = nextConfig
