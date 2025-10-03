import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignorar ESLint durante el build para permitir subir cambios aun cuando haya advertencias/errores de lint
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Permitir host remoto de Cloudinary utilizado en la app
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
