import {
  Box,
  Alert,
  useMantineTheme,
  Title,
  Text,
  Paper,
  Group,
  Image,
  Stack,
  Divider,
} from "@mantine/core";
import Confetti from "react-confetti";
import { IconCake } from "@tabler/icons-react";

import Reactions from "components/sections/Reactions";
import { getLayout } from "components/Layout";
import { QuerySuccess } from "types/makotools";
import getServerSideUser from "services/firebase/getServerSideUser";
import {
  getData,
  getLocalizedDataArray,
  getItemFromLocalizedDataArray,
  getAssetURL,
} from "services/data";
import { useDayjs } from "services/libraries/dayjs";
import { GameCharacter } from "types/game";
import { getNameOrder } from "services/game";
import Picture from "components/core/Picture";

function CharacterMiniInfo({
  label,
  info,
}: {
  label: string;
  info: string | number;
}) {
  return (
    <Group>
      <Text
        sx={(theme) => ({
          fontWeight: "bold",
          paddingLeft: 10,
          borderLeft: `4px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[9]
          }`,
        })}
      >
        {label}
      </Text>
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <Divider
          variant="dotted"
          size="md"
          sx={(theme) => ({
            borderColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[9],
          })}
        />
      </Box>
      <Text
        sx={{
          flexBasis: "50%",
        }}
      >
        {info}
      </Text>
    </Group>
  );
}

function Page({
  characterQuery,
}: {
  characterQuery: QuerySuccess<GameCharacter>;
}) {
  const theme = useMantineTheme();
  const { dayjs } = useDayjs();
  const { data: character } = characterQuery;
  if (character.character_id === 74)
    console.log("oh my god niki shiina from ensemble stars");
  if (character.character_id === 13)
    console.log("no way it's makoto yuuki from makotools");

  console.log(character);
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
            color={theme.primaryColor}
            sx={{ margin: "10px 0px", fontSize: "12pt" }}
          >
            Today is {character.first_name[0]}&apos;s birthday!
          </Alert>
        </>
      )}

      <Box
        pos="relative"
        sx={{
          width: "100%",
          height: "100vh",
          marginTop: 10,
        }}
      >
        <Box
          id="chara-title-info"
          pos="absolute"
          sx={{
            zIndex: 3,
          }}
        >
          <Title
            order={1}
            sx={{
              fontSize: "8rem",
              lineHeight: 1,
            }}
          >
            {character.first_name[0]}
            <br />
            {character.last_name[0] ?? ""}
          </Title>
          <Text
            sx={{
              fontSize: "2rem",
            }}
          >
            CV: {character.character_voice[0]}
          </Text>
          <Title
            order={3}
            size="h2"
            sx={{
              marginTop: "4%",
              maxWidth: "67%",
              display: "flex",
              gap: "25px",
              alignItems: "flex-start",
              "&:before": {
                content: '""',
                width: 0,
                height: 0,
                borderTop: `40px solid ${character.image_color}de`,
                borderLeft: `40px solid transparent`,
              },
            }}
          >
            {character.quote[0]}
          </Title>
        </Box>
        <Box
          id="chara-render"
          pos="absolute"
          sx={{
            width: "100%",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              margin: "auto",
              marginTop: "100px",
              width: "800px",
            }}
          >
            <Picture
              srcB2={`render/character_full1_${character.character_id}.png`}
              transparent
              alt={character.first_name[0]}
              fill={false}
              width={800}
              height={800}
            />
          </Box>
        </Box>
        <Box
          id="chara-info-summary"
          pos="absolute"
          top="25%"
          right="5%"
          sx={{ zIndex: 3 }}
        >
          <Paper
            shadow="md"
            p="md"
            radius="md"
            sx={{
              borderTop: `6px solid ${character.image_color}`,
              width: "20vw",
            }}
          >
            <Group
              sx={{
                justifyContent: "space-between",
              }}
            >
              <Title order={4} size="h3">
                Profile
              </Title>
              {character.unit.map((unit) => (
                <Image
                  key={unit}
                  alt={"unit"}
                  src={getAssetURL(`assets/unit_logo_border_${unit}.png`)}
                  width={100}
                />
              ))}
            </Group>
            <Stack spacing="xs" mt={6}>
              <CharacterMiniInfo label="Age" info={character.age as number} />
              <CharacterMiniInfo
                label="Height"
                info={`${character.height}cm`}
              />
              <CharacterMiniInfo
                label="Weight"
                info={`${character.weight}kg`}
              />
              <CharacterMiniInfo
                label="School"
                info={(character.school as string[])[0] ?? "--"}
              />
              <CharacterMiniInfo
                label="Birthday"
                info={dayjs(character.birthday).format("MMMM DD")}
              />
              <CharacterMiniInfo
                label="Blood type"
                info={character.blood_type}
              />
              <CharacterMiniInfo info={character.hobby[0]} label="Hobby" />
              <CharacterMiniInfo
                info={character.specialty ? character.specialty[0] : "--"}
                label="Specialty"
              />
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* <PageTitle
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
      <Text>{character.introduction[0]}</Text> */}
      <Box
        sx={{
          marginTop: "100vh",
        }}
      >
        <Reactions />
      </Box>
    </>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ res, locale, params, db }) => {
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

    const characterName = getNameOrder(
      character.data,
      db?.setting__name_order,
      locale
    );

    const breadcrumbs = ["characters", characterName];

    return {
      props: {
        characterQuery: character,
        breadcrumbs,
      },
    };
  }
);
Page.getLayout = getLayout({
  wide: true,
});
export default Page;
