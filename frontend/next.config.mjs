/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2qjkwm11akmwu.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;
