/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.base_url
  },
  images: {
    domains: ['res.cloudinary.com'],
  }
}

module.exports = nextConfig
