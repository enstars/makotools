import Head from "next/head";

import { getAssetURL } from "services/data";
import useUser from "services/firebase/user";

interface PictureProps {
  srcB2?: string;
  src?: string;
}

function PicturePreload(props: PictureProps) {
  const user = useUser();

  const dontUseWebP =
    (user.loggedIn && user.db.setting__use_webp === "dont-use") || false;

  const { srcB2, src } = props;
  const newsrc = src || getAssetURL(srcB2 as string);
  const webpSrc = newsrc?.replace("png", "webp");
  return (
    <Head>
      {dontUseWebP ? (
        <link rel="preload" href={newsrc} as="image" />
      ) : (
        <link rel="preload" href={webpSrc} as="image" />
      )}
    </Head>
  );
}

export default PicturePreload;
