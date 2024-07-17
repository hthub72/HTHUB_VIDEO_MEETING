// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  // Asegúrate de que las rutas de API estén habilitadas (aunque por defecto lo están)
  api: {
    bodyParser: true,
  },
};
