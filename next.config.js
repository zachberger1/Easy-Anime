/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.myanimelist.net', 'api.jikan.moe'],
  },
}

module.exports = nextConfig