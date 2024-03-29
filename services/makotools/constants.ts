const CONSTANTS = {
  MAKOTOOLS: {
    EMAIL: "makotools@ensemble.moe",
    LINKS: {},
    COLOR: "#3C59D1",
    TWITTER_UN: "enstars_link",
    SITE_URL: "https://stars.ensemble.moe/",
    SITE_META_BANNER: "meta.jpg",
    SITE_TITLE: "MakoTools",
    META_DESC:
      "MakoTools is a website containing information, tools, and a lot more to aid you in playing Ensemble Stars!! Music English Version, created in collaboration between EN:Link, Daydream Guides, and The Ensemble Stars EN/CN Wiki.",

    CREATORS: [
      { LINK: "https://twitter.com/enstars_link", NAME: "EN:Link" },
      { LINK: "https://twitter.com/DaydreamGuides", NAME: "Daydream Guides" },
      {
        LINK: "https://ensemble-stars.fandom.com",
        NAME: "The English Ensemble Stars Wiki",
      },
      {
        LINK: "https://ensemblestars.huijiwiki.com",
        NAME: "The Chinese Ensemble Stars Wiki",
      },
    ],
  },
  EXTERNAL_URLS: {
    // ASSETS: "https://f002.backblazeb2.com/file/ensemble-square/",
    INTERNAL_APIS: "https://stars.ensemble.moe/api",
    ASSETS: "https://assets.enstars.link/",
    DATA: "https://data.ensemble.moe/",
    DATA_TL: "https://tl.data.ensemble.moe/",
    PREVIEW: "https://preview.ensemble.moe/",
    PATREON: "https://www.patreon.com/makotools",
    SEARCH: "https://oceans.ensemble.moe",
    BACKEND: "https://oceans.ensemble.moe/strapi",
  },
  KEYS: {
    CAPTCHA: "6LfoKlAiAAAAAND6h3R6MapgfOxEH-7usSm7_hIE",
    SEARCH:
      "vKI1H4hs4e03d87b8dc6f15d557418e5bd50face6e20b228d4716e285319cc9001479fdb",
    BACKEND:
      "9645227f1a0ac174f60f56319fc15ad3960c5f7811f69a07ea4aaf705be68c9f8974222c04589fa9c616cd12e09ca0e31c01039b9ba7c520e4345d553b9d15707411eba276a7c495fab69ec73914a71f75a7d8a46c0f2429bd8f38ccf8c763ff20180e6ff3d0e08d3194211d0991b016dd7c3d77105b6e9c1dfa308555a1d24d",
  },
  MODERATION: {
    GET_REPORT_LINK: (username: string, SUID: string) =>
      `https://docs.google.com/forms/d/e/1FAIpQLSdvhp5JggaI2jV8286087m7QFnyhxq5LFngjRGRR7MNWqzN3Q/viewform?usp=pp_url&entry.953932405=__other_option__&entry.953932405.other_option_response=User+Report&entry.1443896834=Reporting+user+@${encodeURIComponent(
        username
      )},+SUID+@${encodeURIComponent(
        SUID
      )}%0A%0A(Optional)+Please+write+any+information+you'd+like+to+add+below+this+line:`,
  },
  PATREON: {
    TIERS: [
      { NAME: "Unsubscribed", VALUE: 0, COLLECTIONS: 5 },
      { NAME: "Shiny Coin", VALUE: 1, COLLECTIONS: 7 },
      { NAME: "Konpeito", VALUE: 5, COLLECTIONS: 10 },
      { NAME: "Manga Volumes", VALUE: 10, COLLECTIONS: 10 },
      { NAME: "Gacha", VALUE: 20, COLLECTIONS: 10 },
    ],
  },
};

export { CONSTANTS };
