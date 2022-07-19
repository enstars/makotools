import { getData, getB2File, getLocalizedData } from "../../services/ensquare";
import Layout from "../../components/Layout";
import Title from "../../components/PageTitle";
import Head from "next/head";
import ImageViewer from "../../components/core/ImageViewer";
import { Text, Box } from "@mantine/core";

function Character({ character }) {
  return (
    <>
      <Head>
        <title>{`${character.first_name} ${character.last_name} - EnSquare`}</title>
        <meta name="description" content={character.introduction} />
      </Head>

      <Title
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
      </Title>
      <Text>{character.introduction}</Text>
      {/* Birthday
      {character.birthday}

      Age
      {character.age} */}
    </>
  );
}

export default Character;

export async function getServerSideProps({ req, res, locale }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=7200, stale-while-revalidate=172800"
  );
  // refresh every 2 hours, stale for 48hrs
  const characters = await getLocalizedData("characters", locale);
  const { data: charactersEN } = await getData("characters", "en");
  const urlSegments = req.url.split("/");
  const lastSegment = decodeURIComponent(urlSegments[urlSegments.length - 1])
    .toLocaleLowerCase()
    .trim();
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

Character.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
