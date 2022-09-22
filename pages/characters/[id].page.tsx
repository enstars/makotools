import { Text, Box, Alert } from "@mantine/core";
import Confetti from "react-confetti";
import { IconCake } from "@tabler/icons";

import {
  getData,
  getB2File,
  getLocalizedDataArray,
  getItemFromLocalizedDataArray,
} from "../../services/ensquare";
import PageTitle from "../../components/sections/PageTitle";
import ImageViewer from "../../components/core/ImageViewer";
import Reactions from "../../components/sections/Reactions";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { getLayout } from "../../components/Layout";
import Picture from "../../components/core/Picture";
import { QuerySuccess } from "../../types/makotools";

function isBirthdayToday(birthday: string) {
  let charBirthday = birthday.split("-");
  let today = new Date();
  if (
    parseInt(charBirthday[1]) === today.getMonth() + 1 &&
    parseInt(charBirthday[2]) === today.getDate()
  ) {
    return true;
  } else {
    return false;
  }
}

function Page({
  character: localizedCharacter,
}: {
  character: QuerySuccess<GameCharacter>;
}) {
  const character = localizedCharacter.data;
  console.log(character);
  return (
    <>
      {isBirthdayToday(character.birthday) && (
        <>
          <Confetti
            width={1200}
            height={1000}
            recycle={false}
            style={{ marginLeft: "15%" }}
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
          <ImageViewer
            src={getB2File(
              `render/character_full1_${character.character_id}.png`
            )}
            alt={character.first_name[0]}
            width={300}
            height={600}
            // objectfit="cover"
          />
        </Box>
      </PageTitle>
      <Text>{character.introduction[0]}</Text>
      <Reactions />
      {/* Birthday
      {character.birthday}

      Age
      {character.age} */}

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

    console.log(characterEN.character_id, characters);
    if (character.status === "error") {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        character,
      },
    };
  }
);
Page.getLayout = getLayout({});
export default Page;
