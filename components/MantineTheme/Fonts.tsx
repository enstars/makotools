import Head from "next/head";

function Fonts() {
  const { locale } = useRouter();
  return (
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      {locale === "th" && (
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      )}
    </Head>
  );
}

export default Fonts;
