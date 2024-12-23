import {
  ActionIcon,
  Box,
  Center,
  Group,
  Menu,
  Paper,
  SegmentedControl,
  Spoiler,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconClock,
  IconDotsVertical,
  IconMoodSmile,
  IconMusic,
} from "@tabler/icons-react";
import { getLayout } from "components/Layout";
import { useState } from "react";
import { getLocalizedDataArray } from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { getNameOrder } from "services/game";
import { secondsToReadableMinutes } from "services/utilities";
import { GameCharacter, GameUnit, Song, SongAlbum } from "types/game";
import { QuerySuccess } from "types/makotools";

function Page({
  songsQuery,
  unitsQuery,
  charasQuery,
  albumsQuery,
}: {
  songsQuery: QuerySuccess<Song[]>;
  unitsQuery: QuerySuccess<GameUnit[]>;
  charasQuery: QuerySuccess<GameCharacter[]>;
  albumsQuery: QuerySuccess<SongAlbum[]>;
}) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: songs } = songsQuery;
  const { data: units } = unitsQuery;
  const { data: characters } = charasQuery;
  const { data: albums } = albumsQuery;

  const orderedSongs = songs
    .filter((song) => song.order)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const [durationType, setDurationType] = useState<string>("full");

  return (
    <>
      <Paper
        radius="lg"
        shadow="md"
        p={isMobile ? "sm" : "xl"}
        mt={8}
        sx={{
          backgroundImage: `linear-gradient(45deg, ${
            theme.colors[theme.primaryColor][
              theme.colorScheme === "dark" ? 9 : 2
            ]
          }${theme.colorScheme === "dark" ? 21 : 55}, transparent )`,
          backgroundAttachment: "fixed",
        }}
      >
        <Group noWrap id="page-header" align="center" spacing="xl" p="xl">
          <Paper
            shadow="sm"
            p="xl"
            sx={{
              aspectRatio: "1",
              width: isMobile ? "20%" : "12vw",
              height: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Center>
              <IconMusic size={isMobile ? 24 : 48} />
            </Center>
          </Paper>
          <Stack>
            <Title order={1} sx={{ fontSize: isMobile ? "3em" : "4em" }}>
              Songs
            </Title>
            <Text>{orderedSongs.length} songs</Text>
          </Stack>
        </Group>
        <Stack spacing="xl" p="xl">
          {!isMobile && (
            <Group
              noWrap
              align="start"
              sx={{
                borderBottom: `1px solid ${
                  theme.colors.dark[theme.colorScheme === "dark" ? 2 : 8]
                }2a`,
              }}
            >
              <Box sx={{ flexBasis: "5vw" }}></Box>
              <Text sx={{ flexBasis: "calc(100% - 50% - 5vw - 4em)" }}>
                Title
              </Text>
              <Text sx={{ flexBasis: "50%" }}>Album</Text>
              <Group sx={{ flexBasis: "4em", gap: 2 }} align="center">
                <IconClock size={20} />
                <Menu withArrow shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon size="xs">
                      <IconDotsVertical size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Duration Options</Menu.Label>
                    <SegmentedControl
                      data={[
                        { label: "Game Size", value: "game" },
                        { label: "Full Size", value: "full" },
                      ]}
                      value={durationType}
                      onChange={setDurationType}
                    />
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          )}
          {orderedSongs.map((song) => {
            const gameDurationInMinutes = song.duration?.game
              ? secondsToReadableMinutes(song.duration.game)
              : "--";

            const fullDurationInMinutes = song.duration?.full
              ? secondsToReadableMinutes(song.duration.full)
              : "--";

            const unitsInSong = song.unit_id
              ? song.unit_id
                  .map((id) =>
                    id === 100
                      ? { id: 100, name: ["ES All Stars"] }
                      : units?.find((unit) => unit.id === id)
                  )
                  .filter((song) => song)
              : [];

            const charactersInSong = song.character_id
              ? song.character_id
                  .flat()
                  .map((id) =>
                    characters.find((chara) => chara.character_id === id)
                  )
                  .filter((song) => song !== undefined)
              : [];

            const songAlbum = albums.find((album) =>
              album.tracklist.find((tracks) => tracks?.includes(song.id))
            );
            console.log({ songAlbum });

            return (
              <Group noWrap>
                <Box
                  sx={{
                    flexBasis: isMobile ? "12vw" : "5vw",
                    minWidth: isMobile ? "12vw" : "5vw",
                  }}
                >
                  <Paper
                    sx={{
                      aspectRatio: "1",
                      height: "100%",
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconMoodSmile />
                  </Paper>
                </Box>
                <Stack
                  sx={{
                    flexGrow: isMobile ? 1 : undefined,
                    flexBasis: !isMobile
                      ? "calc(100% - 50% - 5vw - 4em)"
                      : undefined,
                    gap: 2,
                  }}
                >
                  <Text
                    component="a"
                    href={`/songs/${song.id}`}
                    lineClamp={isMobile ? 1 : undefined}
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                    {song.name}
                  </Text>
                  {unitsInSong.length > 0 ? (
                    isMobile ? (
                      <Spoiler
                        maxHeight={24}
                        showLabel="More"
                        hideLabel="Hide"
                        sx={{
                          display: "flex",
                          control: {
                            display: "inline",
                          },
                        }}
                      >
                        <Box>
                          {unitsInSong.map((unit, index) => (
                            <Text
                              key={unit?.id}
                              color="dimmed"
                              sx={{ display: "inline" }}
                            >
                              {unit?.name[0]}
                              {unitsInSong.length > 1 &&
                              index < unitsInSong.length - 1
                                ? ", "
                                : ""}
                            </Text>
                          ))}
                        </Box>
                      </Spoiler>
                    ) : (
                      <Box>
                        {unitsInSong.map((unit, index) => (
                          <Text
                            key={unit?.id}
                            color="dimmed"
                            sx={{ display: "inline" }}
                          >
                            {unit?.name[0]}
                            {unitsInSong.length > 1 &&
                            index < unitsInSong.length - 1
                              ? ", "
                              : ""}
                          </Text>
                        ))}
                      </Box>
                    )
                  ) : song.unit_name ? (
                    <Text color="dimmed">{song.unit_name}</Text>
                  ) : (
                    <></>
                  )}
                  {charactersInSong.length > 0 &&
                    !song.unit_name &&
                    unitsInSong.length === 0 &&
                    (isMobile ? (
                      <Spoiler
                        maxHeight={24}
                        showLabel="More"
                        hideLabel="Hide"
                        styles={{
                          control: { display: "inline" },
                        }}
                      >
                        <Box>
                          {charactersInSong.map((character, index) => (
                            <>
                              <Text
                                component="a"
                                href={`/characters/${character?.character_id}`}
                                key={character?.character_id}
                                color="dimmed"
                                sx={{ display: "inline" }}
                              >
                                {character &&
                                  getNameOrder({
                                    first_name: character?.first_name[0],
                                    last_name: character?.last_name[0],
                                  })}
                                {}
                              </Text>
                              {character &&
                                charactersInSong.length > 1 &&
                                index < charactersInSong.length - 1 && (
                                  <Text
                                    sx={{ display: "inline" }}
                                    color="dimmed"
                                  >
                                    ,{" "}
                                  </Text>
                                )}
                            </>
                          ))}
                        </Box>
                      </Spoiler>
                    ) : (
                      <Box>
                        {charactersInSong.map((character, index) => (
                          <>
                            <Text
                              component="a"
                              href={`/characters/${character?.character_id}`}
                              key={character?.character_id}
                              color="dimmed"
                              sx={{ display: "inline" }}
                            >
                              {character &&
                                getNameOrder({
                                  first_name: character?.first_name[0],
                                  last_name: character?.last_name[0],
                                })}
                              {}
                            </Text>
                            {character &&
                              charactersInSong.length > 1 &&
                              index < charactersInSong.length - 1 && (
                                <Text sx={{ display: "inline" }} color="dimmed">
                                  ,{" "}
                                </Text>
                              )}
                          </>
                        ))}
                      </Box>
                    ))}
                </Stack>
                {!isMobile && (
                  <Text sx={{ flexBasis: "50%" }}>
                    {songAlbum && songAlbum.name.alt}
                  </Text>
                )}
                {!isMobile && (
                  <Text sx={{ flexBasis: "4em" }}>
                    {durationType === "game"
                      ? gameDurationInMinutes
                      : durationType === "full"
                      ? fullDurationInMinutes
                      : "--"}
                  </Text>
                )}
              </Group>
            );
          })}
        </Stack>
      </Paper>
    </>
  );
}
Page.getLayout = getLayout({ wide: true });

export const getServerSideProps = getServerSideUser(
  async ({ locale, params, db }) => {
    const songData = await getLocalizedDataArray<Song>("songs", locale, "id", [
      "id",
      "name",
      "unit_id",
      "character_id",
      "duration",
      "order",
    ]);

    const unitData = await getLocalizedDataArray<GameUnit>(
      "units",
      locale,
      "id",
      ["id", "name", "order"]
    );

    const charaData = await getLocalizedDataArray<GameCharacter>(
      "characters",
      locale,
      "character_id",
      ["character_id", "name", "sort_id"]
    );

    const albumData = await getLocalizedDataArray<SongAlbum>(
      "albums",
      locale,
      "id",
      ["id", "name", "tracklist"]
    );

    if (!songData) return { notFound: true };
    return {
      props: {
        songsQuery: songData,
        unitsQuery: unitData,
        charasQuery: charaData,
        albumsQuery: albumData,
      },
    };
  }
);

export default Page;
