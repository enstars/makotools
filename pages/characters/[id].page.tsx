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
  Accordion,
  Tooltip,
  ActionIcon,
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
import { circleKeyToName } from "data/circleKeyToName";
import { hexToHSL } from "services/utilities";

function CharacterMiniInfo({
  label,
  info,
}: {
  label: string;
  info: string | number | JSX.Element;
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
  charactersQuery,
}: {
  characterQuery: QuerySuccess<GameCharacter>;
  charactersQuery: QuerySuccess<GameCharacter[]>;
}) {
  const theme = useMantineTheme();
  const { dayjs } = useDayjs();
  const { data: character } = characterQuery;
  const { data: characters } = charactersQuery;
  if (character.character_id === 74)
    console.log("oh my god niki shiina from ensemble stars");
  if (character.character_id === 13)
    console.log("no way it's makoto yuuki from makotools");

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
        id="chara-summary-container"
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
            zIndex: 2,
          }}
        >
          <Title
            order={1}
            sx={{
              fontSize: "6rem",
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
              width: "33%",
              maxWidth: "33%",
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
            zIndex: 3,
          }}
        >
          <Box
            sx={{
              marginLeft: "10%",
              marginTop: "50px",
              width: "700px",
            }}
          >
            <Picture
              srcB2={`render/character_full1_${character.character_id}.png`}
              transparent
              alt={character.first_name[0]}
              fill={false}
              width={700}
              height={700}
            />
          </Box>
        </Box>
        <Box
          id="chara-info-summary"
          pos="absolute"
          top="15%"
          right="5%"
          sx={{ zIndex: 3 }}
        >
          <Paper
            shadow="md"
            p="md"
            radius="md"
            sx={{
              borderTop: `6px solid ${character.image_color}`,
              width: "33vw",
            }}
          >
            <Group
              sx={{
                justifyContent: "space-between",
              }}
            >
              <Title order={3} size="h3">
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
                info={`${dayjs(character.birthday).format("MMMM D")}`}
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
              <CharacterMiniInfo
                info={
                  character.image_color ? (
                    <Group align="center" spacing="xs">
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: character.image_color,
                          borderRadius: 4,
                          boxShadow: theme.shadows.xs,
                        }}
                      />
                      <Text>{character.image_color.toUpperCase()}</Text>
                    </Group>
                  ) : (
                    "--"
                  )
                }
                label="Image color"
              />
            </Stack>
          </Paper>
          {/* <Box
            pos="absolute"
            sx={{
              bottom: 0,
            }}
          >
            <Box
              sx={{
                backgroundColor: character.image_color,
                color: "white",
              }}
            >
              <Stack align="center" spacing="xs">
                <IconStar size={40} />
                Circles
              </Stack>
            </Box>
          </Box> */}
        </Box>
        <Box
          id="chara-bg"
          pos="absolute"
          sx={{ zIndex: 1, width: "100%", height: "100vh" }}
        >
          <Box
            sx={{
              width: "44vw",
              height: "44vw",
              margin: "auto",
              marginTop: "-12.2vw",
              borderRadius: 120,
              border: `2px solid ${character.image_color}22`,
              transform: "rotate(45deg)",
            }}
          />
          <Box
            sx={{
              width: "44vw",
              height: "44vw",
              margin: "auto",
              marginTop: "-22vw",
              borderRadius: 120,
              backgroundColor: `${character.image_color}22`,
              transform: "rotate(45deg)",
            }}
          />
        </Box>
      </Box>
      <Reactions />
      <Box sx={{ width: "95%", margin: "20vh auto 0 auto" }}>
        <Title order={4} size="h2">
          Introduction
        </Title>
        <Text
          component="p"
          sx={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            "&:before": {
              content: "'“'",
              fontSize: "4.5rem",
              fontFamily: "'Sora', sans serif",
              color: `${character.image_color}de`,
            },
          }}
        >
          {character.introduction[0]}
        </Text>

        <Title order={4} size="h2" sx={{ marginTop: "10vh" }}>
          Circles
        </Title>
        <Group grow align="flex-start" sx={{ marginTop: "5vh" }}>
          {character.circle?.map((circle) => {
            const circleMembers = characters.filter((chara) =>
              chara.circle?.includes(circle)
            );
            const hsl = hexToHSL(character.image_color as string);
            console.log(hsl);
            return (
              <Accordion key={circle} variant="contained">
                <Accordion.Item
                  value={circle}
                  sx={{
                    border: "none",
                    borderRadius: "20px !important",
                    padding: "0 !important",
                  }}
                >
                  <Accordion.Control
                    sx={{
                      alignItems: "flex-start",
                      borderRadius: "20px !important",
                      transition: "background-color 0.2s",
                      boxShadow: theme.shadows.xs,
                      backgroundColor:
                        (theme.colorScheme === "light" &&
                          hsl.l < 75 &&
                          (hsl.h < 51 || hsl.h > 60)) ||
                        (theme.colorScheme === "light" &&
                          hsl.h >= 51 &&
                          hsl.h <= 60 &&
                          hsl.l < 40)
                          ? character.image_color
                          : `hsla(${
                              hsl.h - 5 < 0 ? 360 - (hsl.h - 5) : hsl.h - 5
                            }, ${hsl.s - 5}%, ${hsl.l - 5}%, ${
                              theme.colorScheme === "light" ? 1 : 0.7
                            })`,
                      color:
                        theme.colorScheme == "dark" ||
                        (theme.colorScheme === "light" &&
                          hsl.l < 75 &&
                          (hsl.h < 51 || hsl.h > 60)) ||
                        (theme.colorScheme === "light" &&
                          hsl.h >= 51 &&
                          hsl.h <= 60 &&
                          hsl.l < 40)
                          ? "#fff"
                          : `hsl(${
                              hsl.h - 6 < 0 ? 360 - (hsl.h - 6) : hsl.h - 6
                            }, ${hsl.s - 10}%, ${
                              hsl.l - 45 < 20 ? 20 : hsl.l - 45
                            }%)`,
                    }}
                  >
                    <Stack>
                      <Title order={5} size="h3">
                        {circleKeyToName[
                          circle as keyof typeof circleKeyToName
                        ] ?? circle}
                      </Title>
                      <Group
                        sx={{
                          width: "100%",
                        }}
                      >
                        {circleMembers.map((member) => (
                          <Tooltip
                            key={member.character_id}
                            label={`${member.first_name[0]}${
                              member.last_name[0]
                                ? ` ${member.last_name[0]}`
                                : ""
                            }`}
                          >
                            <ActionIcon
                              component="a"
                              href={`/characters/${member.character_id}`}
                              variant="default"
                              size={50}
                              radius={25}
                              sx={{ background: "none", border: "none" }}
                            >
                              <Picture
                                transparent
                                srcB2={`assets/character_sd_square1_${member.character_id}.png`}
                                alt={member.first_name[0]}
                                fill={false}
                                width={50}
                                height={50}
                                sx={{
                                  pointerEvents: "none",
                                }}
                              />
                            </ActionIcon>
                          </Tooltip>
                        ))}
                      </Group>
                    </Stack>
                  </Accordion.Control>
                </Accordion.Item>
              </Accordion>
            );
          })}
        </Group>
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
        charactersQuery: characters,
        breadcrumbs,
      },
    };
  }
);
Page.getLayout = getLayout({
  wide: true,
});
export default Page;
