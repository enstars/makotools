const nextTranslate = require("next-translate");

module.exports = nextTranslate({
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
    config.resolve.alias["cldr$"] = "cldrjs";
    config.resolve.alias["cldr"] = "cldrjs/dist/cldr";

    return config;
  },
  images: {
    domains: ["uchuu.ensemble.moe", "assets.enstars.link"],
  },

  compiler: {
    styledComponents: true,
  },

  // i18n: {
  //   locales: [
  //     // Game official languages
  //     "en", // English
  //     "ja", // Japanese
  //     "zh", // Standard Mandarin / Simplified
  //     "zh-TW", // Taiwanese Mandarin / Traditional
  //     "ko", // Korean

  //     // MakoTools statistics
  //     "id", // Indonesian
  //     "fil", // Filipino
  //     "ms", // Malaysian
  //     "pt-BR", // Brazilian Portugese
  //     "th", // Thai
  //     "vi", // Vietnamese

  //     // Future adoption, hopefully!
  //     // "es", // Spanish
  //     // "de", // German
  //     // "it", // Italian
  //     // "pol", // Polish
  //     // "fr", // French
  //     // "ru", // Russian
  //     // "pt", // Portugese
  //     // "ar", // Arabic
  //   ],
  //   defaultLocale: "en",
  // },

  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],

  async redirects() {
    return [
      {
        source: "/issues/form",
        destination: "https://forms.gle/W2oLnbUeTBJm647R9",
        permanent: false,
      },
    ];
  },
});
