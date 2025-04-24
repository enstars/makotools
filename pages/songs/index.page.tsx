import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  Menu,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Spoiler,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconChevronsDown,
  IconChevronsUp,
  IconClock,
  IconDotsVertical,
  IconMoodSmile,
  IconMusic,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { getLayout } from "components/Layout";
import Image from "next/image";
import { ReactNode, useMemo, useState } from "react";
import { getLocalizedDataArray } from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { getNameOrder } from "services/game";
import { CONSTANTS } from "services/makotools/constants";
import useFSSList from "services/makotools/search";
import { secondsToReadableMinutes } from "services/utilities";
import {
  GameCharacter,
  GameUnit,
  Song,
  SongAlbum,
  SongDurationType,
} from "types/game";
import { QuerySuccess } from "types/makotools";

const defaultView = {
  filters: {
    units: [] as number[],
    characters: [] as number[],
  },
  search: "",
  sort: {
    type: "id",
    ascending: true,
  },
};

type SongWithAlbum = Song & { album_id: number | undefined };

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
  // TODO: add sorting and filter options
  // filter by unit, singers, and album
  // sort by title, unit, album, and duration
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: songs } = songsQuery;
  const { data: units } = unitsQuery;
  const { data: characters } = charasQuery;
  const { data: albums } = albumsQuery;

  function SortButton({
    sortType,
    children,
  }: {
    sortType: string;
    children: ReactNode;
  }) {
    return (
      <Button
        variant="subtle"
        compact
        sx={{
          width: "100%",
          "& .mktl-Button-inner": {
            width: "auto",
            justifyContent: "flex-start",
          },
        }}
        rightIcon={
          view.sort.type === sortType ? (
            view.sort.ascending ? (
              <IconChevronsUp size={18} />
            ) : (
              <IconChevronsDown size={18} />
            )
          ) : undefined
        }
        onClick={() => {
          setView((prevView) => {
            return {
              ...prevView,
              sort: {
                ...prevView.sort,
                type:
                  prevView.sort.type === sortType && prevView.sort.ascending
                    ? sortType
                    : prevView.sort.type === sortType &&
                      !prevView.sort.ascending
                    ? "id"
                    : sortType,
                ascending:
                  prevView.sort.ascending && prevView.sort.type === sortType
                    ? false
                    : true,
              },
            };
          });
        }}
      >
        {children}
      </Button>
    );
  }

  const [durationType, setDurationType] = useState<string>("full");

  const songsWithAlbums: SongWithAlbum[] = songs.map((song) => {
    const songAlbum = albums.find((album) =>
      album.tracklist.find((tracks) => tracks?.includes(song.id))
    );
    return { ...song, album_id: songAlbum?.id };
  });

  const fssOptions = useMemo<
    FSSOptions<SongWithAlbum, typeof defaultView.filters>
  >(() => {
    return {
      filters: [
        {
          type: "units",
          values: [] as number[],
          function: (view) => {
            return (song: SongWithAlbum) => {
              return (
                view.filters.units.filter((value) =>
                  song.unit_id?.includes(value)
                ).length === view.filters.units.length
              );
            };
          },
        },
        {
          type: "characters",
          values: [] as number[],
          function: (view) => {
            return (song: SongWithAlbum) =>
              view.filters.characters.filter((value) =>
                song.character_id?.includes(value)
              ).length === view.filters.characters.length;
          },
        },
      ],
      sorts: [
        {
          label: "Sort by Title",
          value: "name",
          function: (a: SongWithAlbum, b: SongWithAlbum) =>
            a.name.localeCompare(b.name),
        },
        {
          label: "Sort by Album",
          value: "album",
          function: (a: SongWithAlbum, b: SongWithAlbum) => {
            const aAlbum = albums.find((album) => album.id === a.album_id);
            const bAlbum = albums.find((album) => album.id === b.album_id);

            return aAlbum?.name.alt.localeCompare(bAlbum?.name.alt ?? "") ?? 0;
          },
        },
        {
          label: "Sort by Duration",
          value: "duration",
          function: (a: SongWithAlbum, b: SongWithAlbum) => {
            const aDuration =
              a.duration?.[durationType as SongDurationType] ?? 0;
            const bDuration =
              b.duration?.[durationType as SongDurationType] ?? 0;
            return aDuration - bDuration;
          },
        },
      ],
      baseSort: "id",
      search: {
        fields: ["name.0", "name.1", "name.2"],
      },
      defaultView,
    };
  }, [songs, durationType]);

  const { results, view, setView } = useFSSList<
    SongWithAlbum,
    typeof defaultView.filters
  >(songsWithAlbums, fssOptions);

  const shuffledAlbums = [
    albums[Math.floor(Math.random() * (albums.length - 1))],
    albums[Math.floor(Math.random() * (albums.length - 1))],
    albums[Math.floor(Math.random() * (albums.length - 1))],
    albums[Math.floor(Math.random() * (albums.length - 1))],
  ];

  console.log({ albums, shuffledAlbums });

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
            sx={{
              aspectRatio: "1",
              width: isMobile ? "20%" : "12vw",
              height: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <SimpleGrid cols={2} spacing={0} verticalSpacing={0}>
              {shuffledAlbums.map((album) => {
                return (
                  <Image
                    src={`${CONSTANTS.EXTERNAL_URLS.ASSETS}albums/${album.id}.jpg`}
                    alt={album.name.alt}
                    width={120}
                    height={120}
                    style={{ width: "100%", height: "100%" }}
                  />
                );
              })}
            </SimpleGrid>
          </Paper>
          <Stack>
            <Title order={1} sx={{ fontSize: isMobile ? "3em" : "4em" }}>
              Songs
            </Title>
            <Text>{results.length} songs</Text>
          </Stack>
        </Group>
        <Box
          id="search-bar-container"
          sx={{
            paddingLeft: theme.spacing.sm,
            paddingRight: theme.spacing.sm,
            marginTop: theme.spacing.md,
            marginBottom: theme.spacing.md,
            "& .mktl-TextInput-input": {
              borderRadius: 50,
            },
          }}
        >
          <TextInput
            sx={{ borderRadius: "50px" }}
            icon={<IconSearch />}
            placeholder="Search for a song..."
            value={view.search}
            onChange={(event) => {
              setView((v) => ({
                ...v,
                search: event.target.value,
              }));
            }}
          />
        </Box>
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
              <Box sx={{ flexBasis: "calc(100% - 50% - 5vw - 4em)" }}>
                <SortButton sortType="name">Title</SortButton>
              </Box>
              <Text sx={{ flexBasis: "50%", cursor: "pointer" }}>
                <SortButton sortType="album">Album</SortButton>
              </Text>
              <Box sx={{ flexBasis: "4em" }}>
                <SortButton sortType="duration">
                  <IconClock size={20} />
                </SortButton>
              </Box>
            </Group>
          )}
          {results.map((song) => {
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

            const songAlbum = albums.find(
              (album) => album.id === song.album_id
            );

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
                      overflow: "hidden",
                    }}
                  >
                    {song.album_id ? (
                      <Image
                        src={`${CONSTANTS.EXTERNAL_URLS.ASSETS}/albums/${song.album_id}.jpg`}
                        alt={String(song.album_id)}
                        width={120}
                        height={120}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <IconMoodSmile />
                    )}
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

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
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
});

export default Page;
