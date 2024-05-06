
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: false,
	env: {
    BASE_URL: process.env.base_url
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
});

module.exports = nextConfig;