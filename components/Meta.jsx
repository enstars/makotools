import Head from "next/head";
import { MAKOTOOLS } from "../services/constants";

function Meta({ title, desc, img }) {
  const pageTitle = title
    ? `${title} - ${MAKOTOOLS.SITE_TITLE}`
    : MAKOTOOLS.SITE_TITLE;
  const pageDesc = desc || MAKOTOOLS.META_DESC;
  const pageImg = img || MAKOTOOLS.SITE_URL + MAKOTOOLS.SITE_META_BANNER;
  // const pageImg = img || MAKOTOOLS.SITE_META_BANNER;
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDesc} />

      {/* <meta property="og:type" content="profile" /> */}
      <meta property="og:url" content={MAKOTOOLS.SITE_URL} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={pageImg} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={MAKOTOOLS.SITE_URL} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDesc} />
      <meta property="twitter:image" content={pageImg} />
      <meta property="twitter:creator" content={MAKOTOOLS.TWITTER_UN} />
    </Head>
  );
}

export default Meta;

//stolen from tomoya.moe heehee
