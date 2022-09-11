import Head from "next/head";
import { Text, Box } from "@mantine/core";

import {
  getData,
  getB2File,
  getLocalizedData,
  getItemFromLocalized,
} from "../../services/ensquare";
import PageTitle from "../../components/sections/PageTitle";
import ImageViewer from "../../components/core/ImageViewer";
import Reactions from "../../components/sections/Reactions";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { getLayout } from "../../components/Layout";
import Picture from "../../components/core/Picture";

function Page({ character }: { character: any }) {
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
            // objectfit="cover"
          />
        </Box>
      </PageTitle>
      <Text>{character.introduction}</Text>
      <Reactions />
      {/* Birthday
      {character.birthday}

      Age
      {character.age} */}

      <Picture
        srcB2={`render/character_full1_${character.character_id}.png`}
        alt={character.first_name}
        sx={{
          width: 300,
          height: 600,
        }}
        action="view"
        transparent
      />
    </>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ res, locale, params }) => {
    const characters = await getLocalizedData<GameCharacter[]>(
      "characters",
      locale
    );
    const charsEN = await getData<GameCharacter[]>("characters", "en");
    if (!characters || charsEN.status === "error") return { notFound: true };
    const { data: charactersEN } = charsEN;

    if (!params?.id || Array.isArray(params?.id)) return { notFound: true };

    const lastSegment = params?.id?.toLocaleLowerCase();
    const characterID = parseInt(lastSegment, 10);
    const isName = isNaN(characterID);

    const characterEN = charactersEN.find(
      isName
        ? (item) =>
            `${item.last_name} ${item.first_name}`.toLocaleLowerCase() ===
              lastSegment ||
            `${item.first_name} ${item.last_name}`.toLocaleLowerCase() ===
              lastSegment ||
            `${item.first_name}`.toLocaleLowerCase() === lastSegment
        : (item) => item.character_id === characterID
    );

    if (typeof characterEN === "undefined") {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        character: getItemFromLocalized(
          characters,
          characterEN.character_id,
          "character_id"
        ),
      },
    };
  }
);
Page.getLayout = getLayout({});
export default Page;
