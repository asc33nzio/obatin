/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-icons'],
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
