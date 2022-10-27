import { Text, Box, Alert } from "@mantine/core";
import Confetti from "react-confetti";
import { IconCake } from "@tabler/icons";

import {
  getData,
  getLocalizedDataArray,
  getItemFromLocalizedDataArray,
} from "../../services/data";
import PageTitle from "../../components/sections/PageTitle";
import Reactions from "../../components/sections/Reactions";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { getLayout } from "../../components/Layout";
import Picture from "../../components/core/Picture";
import { QuerySuccess } from "../../types/makotools";

import { useDayjs } from "services/libraries/dayjs";
import { GameCharacter } from "types/game";

function Page({
  characterQuery,
}: {
  characterQuery: QuerySuccess<GameCharacter>;
}) {
  const { dayjs } = useDayjs();
  const { data: character } = characterQuery;
  return (
    <>
      {dayjs(character.birthday).year(new Date().getFullYear()).isToday() && (
        <>
          <Confetti
            width={1200}
            height={1000}
            recycle={false}
            style={{ margin: "auto", marginTop: "-10%" }}
          />
          <Alert
            icon={<IconCake />}
            color="indigo"
            sx={{ margin: "10px 0px", fontSize: "12pt" }}
          >
            Today is {character.first_name[0]}&apos;s birthday!
          </Alert>
        </>
      )}
      <PageTitle
        title={
          <>
            <ruby>
              {character.first_name[0]}
              {character.first_nameRuby?.[0] && (
                <>
                  <rp> (</rp>
                  <Text component="rt">{character.first_nameRuby[0]}</Text>
                  <rp>)</rp>
                </>
              )}
            </ruby>{" "}
            <ruby>
              {character.last_name[0]}

              {character.last_nameRuby?.[0] && (
                <>
                  <rp> (</rp>
                  <Text component="rt">{character.last_nameRuby[0]}</Text>
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
          <Picture
            srcB2={`render/character_full1_${character.character_id}.png`}
            transparent
            alt={character.first_name[0]}
            fill={false}
            width={300}
            height={600}
          />
        </Box>
      </PageTitle>
      <Text>{character.introduction[0]}</Text>
      <Reactions />

      <Picture
        srcB2={`render/character_full1_${character.character_id}.png`}
        alt={character.first_name[0]}
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
    const characters = await getLocalizedDataArray<GameCharacter>(
      "characters",
      locale,
      "character_id"
    );
    const charsEN = await getData<GameCharacter<string>[]>("characters", "en");
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

    const character = getItemFromLocalizedDataArray<GameCharacter>(
      characters,
      characterEN.character_id,
      "character_id"
    );

    if (character.status === "error") {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        characterQuery: character,
      },
    };
  }
);
Page.getLayout = getLayout({});
export default Page;
