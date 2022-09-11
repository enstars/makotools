import Head from "next/head";

import { CONSTANTS } from "../../services/constants";
import { PageMeta } from "../../types/makotools";

function Meta({ title, desc, img }: PageMeta) {
  console.log("meta", title, desc, img);
  const pageTitle = title
    ? `${title} - ${CONSTANTS.MAKOTOOLS.SITE_TITLE}`
    : CONSTANTS.MAKOTOOLS.SITE_TITLE;
  const pageDesc = desc || CONSTANTS.MAKOTOOLS.META_DESC;
  const pageImg =
    img || CONSTANTS.MAKOTOOLS.SITE_URL + CONSTANTS.MAKOTOOLS.SITE_META_BANNER;
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDesc} />

      <meta property="og:url" content={CONSTANTS.MAKOTOOLS.SITE_URL} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={pageImg} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={CONSTANTS.MAKOTOOLS.SITE_URL} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDesc} />
      <meta property="twitter:image" content={pageImg} />
      <meta
        property="twitter:creator"
        content={CONSTANTS.MAKOTOOLS.TWITTER_UN}
      />
    </Head>
  );
}

export default Meta;

//stolen from tomoya.moe heehee (lol)
