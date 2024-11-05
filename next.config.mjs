/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable webpack persistent caching
  experimental: {
    webpackBuildWorker: false,
  },
  webpack: (config) => {
    // Disable cache
    config.cache = false;
    
    // Reduce logging
    config.infrastructureLogging = {
      level: 'none'
    };

    return config;
  }
};

export default nextConfig;
