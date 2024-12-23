import {
  Accordion,
  Anchor,
  Box,
  DefaultMantineColor,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import {
  IconAward,
  IconMoodSing,
  IconMusic,
  IconPlayerPlay,
  IconStar,
} from "@tabler/icons-react";
import Picture from "components/core/Picture";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import { getLayout } from "components/Layout";
import Link from "next/link";
import CharacterCard from "pages/characters/components/CharacterCard";
import { CharacterMiniInfo } from "pages/characters/components/CharacterMiniInfo";
import SectionTitle from "pages/events/components/SectionTitle";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { getNameOrder } from "services/game";
import { secondsToReadableMinutes } from "services/utilities";
import { Event, GameCharacter, GameUnit, Song } from "types/game";
import { QuerySuccess } from "types/makotools";

function Page({
  songQuery,
  unitsQuery,
  charaQuery,
  eventsQuery,
}: {
  songQuery: QuerySuccess<Song>;
  unitsQuery: QuerySuccess<GameUnit[]>;
  charaQuery: QuerySuccess<GameCharacter[]>;
  eventsQuery: QuerySuccess<Event[]>;
}) {
  const theme = useMantineTheme();
  const { data: song } = songQuery;
  const { data: units } = unitsQuery;
  const { data: characters } = charaQuery;
  const { data: events } = eventsQuery;

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const { width, height } = useViewportSize();

  const unitName = song.unit_name
    ? [song.unit_name]
    : song.unit_id
    ? units
        .filter((unit) => song.unit_id?.includes(unit.id))
        .map((unit) => unit.name.filter((name) => name !== null)[0])
    : song.character_id
    ? characters.filter((chara) =>
        song.character_id?.includes(chara.character_id)
      )
    : [];

  const colors: Array<DefaultMantineColor> = [
    "dark",
    "red",
    "blue",
    "green",
    "yellow",
  ];

  const songColor = theme.colors[colors[song.color ?? 1]];
  const textOutlineColor =
    theme.colorScheme === "dark"
      ? theme.colors.dark[8]
      : theme.fn.lighten(theme.colors.gray[0], 0.5);

  const correspondingEvent = events.find(
    (event) => event.event_id === song.event_id
  );

  console.log({ song, units, correspondingEvent });

  return (
    <Box mt={48} pb={64} pos="relative">
      <Box
        id="chara-bg"
        pos="absolute"
        sx={{ zIndex: -1, width: "100%", height: "100vh", top: 0 }}
      >
        <Box
          sx={{
            width: "44vw",
            height: "44vw",
            margin: "auto",
            marginTop: "-12.2vw",
            borderRadius: 120,
            border: `4px solid ${songColor[4]}22`,
            transform: "rotate(45deg)",
            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
              width: "50vh",
              height: "50vh",
              borderRadius: 75,
            },
          }}
        />
        <Box
          sx={{
            width: "44vw",
            height: "44vw",
            margin: "auto",
            marginTop: "-22vw",
            borderRadius: 120,
            backgroundColor: `${songColor[4]}22`,
            transform: "rotate(45deg)",
            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
              width: "50vh",
              height: "50vh",
              borderRadius: 75,
              marginTop: "-10vh",
            },
          }}
        />
      </Box>
      <Group
        id="header"
        align="start"
        sx={{
          gap: 48,
          width: !isMobile ? "max(50vw, calc(95% - 310px))" : "100%",
        }}
        mb={48}
      >
        <Paper
          sx={{
            aspectRatio: "1",
            flexBasis: isMobile ? "33vw" : "12vw",
            height: "auto",
            boxShadow: `12px 12px 0px ${songColor[4]}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconMusic size={48} />
        </Paper>
        <Stack mt={isMobile ? -72 : undefined}>
          <Title
            order={1}
            sx={{
              fontSize: 48,
              textShadow: isMobile
                ? `${textOutlineColor} 3px 0px 0px, ${textOutlineColor} 2.83487px 0.981584px 0px, ${textOutlineColor} 2.35766px 1.85511px 0px, ${textOutlineColor} 1.62091px 2.52441px 0px, ${textOutlineColor} 0.705713px 2.91581px 0px, ${textOutlineColor} -0.287171px 2.98622px 0px, ${textOutlineColor} -1.24844px 2.72789px 0px, ${textOutlineColor} -2.07227px 2.16926px 0px, ${textOutlineColor} -2.66798px 1.37182px 0px, ${textOutlineColor} -2.96998px 0.42336px 0px, ${textOutlineColor} -2.94502px -0.571704px 0px, ${textOutlineColor} -2.59586px -1.50383px 0px, ${textOutlineColor} -1.96093px -2.27041px 0px, ${textOutlineColor} -1.11013px -2.78704px 0px, ${textOutlineColor} -0.137119px -2.99686px 0px, ${textOutlineColor} 0.850987px -2.87677px 0px, ${textOutlineColor} 1.74541px -2.43999px 0px, ${textOutlineColor} 2.44769px -1.73459px 0px, ${textOutlineColor} 2.88051px -0.838247px 0px;`
                : undefined,
            }}
          >
            {song.name}
          </Title>
          {!!unitName?.length && (
            <Text sx={{ fontSize: 24 }}>{unitName.join(",")}</Text>
          )}
          {!!song.character_id?.length && (
            <Group mt={24} sx={{ gap: 0 }}>
              <IconMoodSing size={36} />
              {song.character_id.flat().map((id) => {
                const correspondingCharacter = characters.find(
                  (character) => character.character_id === id
                );
                if (!correspondingCharacter) return <></>;
                return (
                  <Tooltip
                    position="bottom"
                    label={getNameOrder({
                      first_name: correspondingCharacter.first_name[0],
                      last_name: correspondingCharacter.last_name[0],
                    })}
                  >
                    <Anchor component={Link} href={`/characters/${id}`}>
                      <Picture
                        srcB2={`assets/character_sd_square1_${id}.png`}
                        alt={correspondingCharacter.first_name[0]}
                        sx={{ aspectRatio: "1", width: 75, height: "auto" }}
                        transparent
                      />
                    </Anchor>
                  </Tooltip>
                );
              })}
            </Group>
          )}
        </Stack>
      </Group>
      <Paper
        p="md"
        shadow="lg"
        sx={{
          position: isMobile ? undefined : "fixed",
          top: 0,
          right: 0,
          width: "min(100%, 310px)",
          zIndex: 2,
          borderTop: `6px solid ${songColor[4]}`,
        }}
        mt={isMobile ? undefined : 128 * (width / 1904)}
        mr={isMobile ? undefined : 128 * (height / 992)}
      >
        <Stack spacing="xl">
          <Box>
            <Title order={4} mb={4}>
              Song Information
            </Title>
            <Stack spacing="xs">
              {song.lyric && (
                <CharacterMiniInfo label="Lyricist" info={song.lyric} />
              )}
              {song.composition && (
                <CharacterMiniInfo
                  label="Composition"
                  info={song.composition}
                />
              )}
              {song.arrangement && (
                <CharacterMiniInfo
                  label="Arrangement"
                  info={song.arrangement}
                />
              )}
            </Stack>
          </Box>
          {song.duration && (
            <Box>
              <Title order={4}>Duration</Title>
              <Paper withBorder radius="lg" mt={8}>
                <Table horizontalSpacing="xl">
                  <thead>
                    <tr>
                      {song.duration.game && <th>Game Edit</th>}
                      {song.duration.full && <th>Full</th>}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {song.duration.game && (
                        <td>{secondsToReadableMinutes(song.duration.game)}</td>
                      )}
                      {song.duration.full && (
                        <td>{secondsToReadableMinutes(song.duration.full)}</td>
                      )}
                    </tr>
                  </tbody>
                </Table>
              </Paper>
            </Box>
          )}
          {song.difficulty && (
            <Box>
              <Title order={4} mb={4}>
                Difficulty
              </Title>
              <Paper withBorder radius="lg" p="md">
                <Stack spacing="lg">
                  {Object.entries(song.difficulty)
                    .filter(([difficulty, lvl]) => !difficulty.includes("_"))
                    .map(([difficulty, lvl], index) => (
                      <Group position="apart">
                        <Stack sx={{ gap: 0, flexBasis: "50%" }}>
                          <Text fw="bold">
                            {difficulty[0].toUpperCase() + difficulty.slice(1)}
                          </Text>
                          <Group noWrap sx={{ gap: 0 }}>
                            {[...Array(index + 1).keys()].map(() => (
                              <IconStar
                                size={12}
                                color={theme.colors[theme.primaryColor][5]}
                              />
                            ))}
                          </Group>
                        </Stack>
                        <Box>
                          <Text>Lv. {lvl}</Text>
                        </Box>
                      </Group>
                    ))}
                </Stack>
              </Paper>
            </Box>
          )}
        </Stack>
      </Paper>
      <Box
        id="song-page-float-left"
        mt={48}
        sx={!isMobile ? { width: "calc(95% - 350px)" } : undefined}
      >
        <SectionTitle Icon={IconPlayerPlay} title={<>Stream</>} />
        <Box p="sm">
          <Paper shadow="xs" mb={32}>
            <Accordion
              variant="filled"
              defaultValue="videos"
              styles={{ control: { padding: "8px 16px" } }}
            >
              <Accordion.Item value="videos">
                <Accordion.Control>
                  <Title order={3}>Music Videos</Title>
                </Accordion.Control>
                <Accordion.Panel>
                  <ResponsiveGrid width={300}>
                    {song.link &&
                      !!Object.keys(song.link).length &&
                      Object.values(song.link).map((url) => {
                        const splitUrl = url.split("/");
                        const urlId = splitUrl[splitUrl.length - 1];
                        const embedUrl = `https://youtube.com/embed/${urlId}`;
                        return (
                          <Box>
                            <iframe
                              width="285"
                              height={`${285 * (9 / 16)}`}
                              src={embedUrl}
                              title="YouTube video player"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                              style={{ border: "none", borderRadius: "8px" }}
                            ></iframe>
                          </Box>
                        );
                      })}
                  </ResponsiveGrid>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Paper>
        </Box>

        {correspondingEvent && (
          <>
            <SectionTitle title={<>Associated Event</>} Icon={IconAward} />
            <Box mt={8}>
              <Group mt={16} align="start">
                <Picture
                  alt={
                    correspondingEvent.name.filter((name) => name !== null)[0]
                  }
                  srcB2={`assets/card_still_full1_${correspondingEvent.banner_id}_evolution.png`}
                  sx={{
                    aspectRatio: "13/6",
                    flexBasis: "25%",
                    height: "auto",
                    minHeight: 100,
                  }}
                  radius="sm"
                />
                <Stack>
                  <Title order={3}>
                    {correspondingEvent.name.filter((name) => name !== null)[0]}
                  </Title>
                  <Text>
                    {
                      correspondingEvent.intro_lines?.filter(
                        (lines) => lines !== null
                      )[0]
                    }
                  </Text>
                  {!!correspondingEvent.intro_lines_tl_credit?.filter(
                    (cred) => cred !== null
                  )?.length && (
                    <Text color="dimmed" size="sm">
                      Translated by {correspondingEvent.intro_lines_tl_credit}
                    </Text>
                  )}
                  <Anchor
                    component={Link}
                    href={`/events/${correspondingEvent.event_id}`}
                  >
                    More Details
                  </Anchor>
                </Stack>
              </Group>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ locale, params }) => {
    if (!params?.id || Array.isArray(params?.id)) return { notFound: true };

    const songs = await getLocalizedDataArray<Song>("songs", locale, "id");
    const song = getItemFromLocalizedDataArray(
      songs,
      parseInt(params.id),
      "id"
    );

    if (song.status === "error") return { notFound: true };
    const units = await getLocalizedDataArray<GameUnit>("units", locale, "id");
    const characters = await getLocalizedDataArray<GameCharacter>(
      "characters",
      locale,
      "character_id"
    );
    const events = await getLocalizedDataArray<Event>(
      "events",
      locale,
      "event_id"
    );

    const breadcrumbs = ["songs", `${song.data.id}[ID]${song.data.name}`];

    return {
      props: {
        songQuery: song,
        unitsQuery: units,
        charaQuery: characters,
        eventsQuery: events,
        breadcrumbs,
        meta: {
          title: song.data.name,
        },
      },
    };
  }
);

Page.getLayout = getLayout({ wide: true });
export default Page;
