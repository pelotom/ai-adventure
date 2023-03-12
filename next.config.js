module.exports = {
  webpack: (config, options) => {
    config.experiments.topLevelAwait = true;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
    ],
  },
};
