/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "render.albiononline.com",
      },
    ],
  },
};

module.exports = nextConfig;
