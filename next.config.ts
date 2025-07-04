import { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // …setting serverExternalPackages, compiler, dsb. tetap sama…

  webpack: (config) => {
    // Batasi context hanya ke root project
    config.context = path.resolve(__dirname);

    // Tambahkan rule di paling depan untuk ignore Application Data
    config.module.rules.unshift({
      test: /[\\/]Users[\\/]DAVE[\\/]Application Data[\\/]/,
      use: 'ignore-loader',
    });

    return config;
  },
};

export default nextConfig;
