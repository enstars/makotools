require("dotenv").config();

const nextTranslate = require("next-translate");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(
  nextTranslate({
    webpack: (config) => {
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
  })
);
