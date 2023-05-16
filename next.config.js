/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    url_province: process.env.url_province,
    url_city: process.env.url_city,
    url_district: process.env.url_district,
    url_sub_district: process.env.url_sub_district
  },
}

module.exports = nextConfig
