module.exports = {
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/i,
        type: "asset",
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        use: ["@svgr/webpack"],
      }
    );

    return config;
  },
  images: {
    domains: ["uchuu.ensemble.moe"],
  },

  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },

  i18n: {
    locales: [
      // game languages
      "en", // English
      "ja", // Japanese
      "zh-CN", // Standard Mandarin / Simplified
      "zh-TW", // Taiwanese Mandarin / Traditional
      "ko", // Korean
      // Oissu Statistics
      "id", // Indonesian
      "fil", // Filipino
      "vi", // Vietnamese
      "ru", // Russian
      "ms", // Malaysian
      "es", // Spanish
      "pt", // Portugese
      "pt-BR", // Brazilian Portugese
      "fr", // French
      "de", // German
      "it", // Italian
      "ar", // Arabic
      "th", // Thai
    ],
    defaultLocale: "en",
  },

  async redirects() {
    return [];
  },
};
