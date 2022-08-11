import Head from "next/head";

import { Text, Box } from "@mantine/core";

import { getData, getB2File, getLocalizedData } from "../../services/ensquare";
import Layout from "../../components/Layout";
import PageTitle from "../../components/PageTitle";
import ImageViewer from "../../components/core/ImageViewer";

import Reactions from "../../components/core/Reactions";

function Page({ character }) {
  const getBreadcrumbs = (path) => {
    const pathNames = path.split("/");
    pathNames[
      pathNames.length - 1
    ] = `${character.first_name} ${character.last_name}`;
    return pathNames.filter((x) => x);
  };

  return (
    <>
      <Head>
        <title>{`${character.first_name} ${character.last_name} - EnSquare`}</title>
        <meta name="description" content={character.introduction} />
      </Head>

      <PageTitle
        title={
          <>
            <ruby>
              {character.first_name}
              {character.first_nameRuby && (
                <>
                  <rp> (</rp>
                  <Text component="rt">{character.first_nameRuby}</Text>
                  <rp>)</rp>
                </>
              )}
            </ruby>{" "}
            <ruby>
              {character.last_name}

              {character.last_nameRuby && (
                <>
                  <rp> (</rp>
                  <Text component="rt">{character.last_nameRuby}</Text>
                  <rp>)</rp>
                </>
              )}
            </ruby>
          </>
        }
        space={192}
        getBreadcrumbs={getBreadcrumbs}
      >
        <Box
          sx={{
            position: "absolute",
            paddingTop: 16,
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 5,
            mask: "linear-gradient(185deg, #000F 190px, #0000 245px)",
            background: `linear-gradient(205deg, ${character.image_color}44, transparent 205px)`,
            borderRadius: 16,
          }}
        >
          <ImageViewer
            src={getB2File(
              `render/character_full1_${character.character_id}.png`
            )}
            alt={character.first_name}
            width={300}
            height={600}
            objectfit="cover"
          />
        </Box>
      </PageTitle>
      <Text>{character.introduction}</Text>
      <Reactions />
      {/* Birthday
      {character.birthday}

      Age
      {character.age} */}
    </>
  );
}

export default Page;

export async function getServerSideProps({ res, locale, params }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=7200, stale-while-revalidate=172800"
  );
  // refresh every 2 hours, stale for 48hrs
  const characters = await getLocalizedData("characters", locale);
  const { data: charactersEN } = await getData("characters", "en");
  const lastSegment = params.id.toLocaleLowerCase();
  const characterID = parseInt(lastSegment, 10);
  const isName = isNaN(characterID);
  const characterIndex = charactersEN.indexOf(
    charactersEN.find(
      isName
        ? (item) =>
            `${item.last_name} ${item.first_name}`.toLocaleLowerCase() ===
              lastSegment ||
            `${item.first_name} ${item.last_name}`.toLocaleLowerCase() ===
              lastSegment ||
            `${item.first_name}`.toLocaleLowerCase() === lastSegment
        : (item) => item.character_id === characterID
    )
  );

  if (characterIndex === -1) {
    return {
      notFound: true,
    };
  }

  return {
    props: { character: characters.mainLang.data[characterIndex] },
  };
}

Page.getLayout = function getLayout(page, pageProps) {
  return <Layout pageProps={pageProps}>{page}</Layout>;
};
