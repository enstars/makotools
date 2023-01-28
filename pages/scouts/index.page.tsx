import {
  ActionIcon,
  Alert,
  Button,
  Group,
  MultiSelect,
  Paper,
  Select,
  Tabs,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowsSort,
  IconComet,
  IconDiamond,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import { useListState, useMediaQuery } from "@mantine/hooks";

import ScoutCard from "./components/ScoutCard";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameCard, GameCharacter, Scout } from "types/game";
import { QuerySuccess, UserLoggedIn } from "types/makotools";
import { useDayjs } from "services/libraries/dayjs";
import useFSSList from "services/makotools/search";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import useUser from "services/firebase/user";

const defaultView = {
  filters: {
    characters: [] as number[],
  },
  search: "",
  sort: {
    type: "id",
    ascending: true,
  },
};

function Page({
  scoutsQuery,
  cardsQuery,
  charactersQuery,
}: {
  scoutsQuery: QuerySuccess<Scout[]>;
  cardsQuery: QuerySuccess<GameCard[]>;
  charactersQuery: QuerySuccess<GameCharacter[]>;
}) {
  const user = useUser();
  const { dayjs } = useDayjs();
  const theme = useMantineTheme();

  const scouts: Scout[] = useMemo(() => scoutsQuery.data, [scoutsQuery.data]);
  const cards: GameCard[] = useMemo(() => cardsQuery.data, [cardsQuery.data]);
  const characters = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const fssOptions = useMemo<FSSOptions<Scout, typeof defaultView.filters>>(
    () => ({
      filters: [
        {
          type: "characters",
          values: [],
          function: (view) => {
            return (scout) =>
              view.filters.characters.filter((value: number) => {
                return cards
                  .filter((card) => scout.cards?.includes(card.id))
                  .map((card) => card.character_id)
                  .includes(value);
              }).length > 0;
          },
        },
      ],
      sorts: [
        {
          label: "Scout ID",
          value: "id",
          function: (a: Scout, b: Scout) => a.gacha_id - b.gacha_id,
        },
        {
          label: "Start Date",
          value: "date",
          function: (a: Scout, b: Scout) =>
            dayjs(a.start.en).unix() - dayjs(b.start.en).unix(),
        },
      ],
      baseSort: "id",
      search: {
        fields: ["name.0", "name.1", "name.2"],
      },
      defaultView,
    }),
    []
  );
  const { results, view, setView } = useFSSList<
    Scout,
    typeof defaultView.filters
  >(scouts, fssOptions);

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const [bookmarks, handlers] = useListState<number>(
    (user as UserLoggedIn).db.bookmarks__scouts || []
  );

  useEffect(() => {
    user.loggedIn &&
      user.db.set({
        bookmarks__scouts: bookmarks,
      });
  }, [bookmarks]);

  return (
    <>
      <PageTitle title="Scouts" />
      <Alert
        icon={<IconAlertCircle size={16} strokeWidth={3} />}
        color={theme.primaryColor}
      >
        Scouts are gradually being added to MakoTools. We appreciate your
        patience!
      </Alert>
      <Paper mt="sm" p="md" withBorder>
        <Text weight="700" size="xs" color="dimmed">
          <IconSearch size="1em" /> Search Options
        </Text>
        <Group>
          <TextInput
            label="Search"
            placeholder="Type a scout name..."
            value={view.search}
            onChange={(event) => {
              setView((v) => ({
                ...v,
                search: event.target.value,
              }));
            }}
            sx={{ maxWidth: 200 }}
            variant="default"
            icon={<IconSearch size="1em" />}
          />
          <Select
            label="Sort by"
            placeholder="Select sorting option..."
            data={fssOptions.sorts}
            value={view.sort.type}
            onChange={(value) => {
              if (value)
                setView((v) => ({
                  ...v,
                  sort: {
                    ...v.sort,
                    type: value,
                  },
                }));
            }}
            sx={{ maxWidth: 200 }}
            variant="default"
            icon={<IconArrowsSort size="1em" />}
            rightSection={
              <Tooltip label="Toggle ascending/descending">
                <ActionIcon
                  onClick={() => {
                    setView((v) => ({
                      ...v,
                      sort: {
                        ...v.sort,
                        ascending: !v.sort.ascending,
                      },
                    }));
                  }}
                  variant="light"
                  color="theme.primaryColor"
                >
                  {view.sort.ascending ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Tooltip>
            }
          />
          <MultiSelect
            label="Featured Characters"
            placeholder="Pick a character..."
            data={characters
              .sort((a: any, b: any) => a.sort_id - b.sort_id)
              .map((c: GameCharacter) => {
                return {
                  value: c.character_id.toString(),
                  label: c.first_name[0],
                };
              })}
            onChange={(val) => {
              setView((v) => ({
                ...v,
                filters: {
                  ...v.filters,
                  characters: val.map((id) => parseInt(id)),
                },
              }));
            }}
            sx={{ maxWidth: 400 }}
            variant="default"
            searchable
          />
          <Button
            compact
            onClick={() => {
              setView(defaultView);
            }}
          >
            Reset all filters
          </Button>
        </Group>
      </Paper>
      <Tabs
        orientation={isMobile ? "horizontal" : "vertical"}
        defaultValue="event"
        pt="xs"
      >
        <Tabs.List
          sx={{
            position: "sticky",
            top: "40px",
            alignSelf: "start",
            zIndex: 20,
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.fn.lighten(theme.colors.gray[0], 0.5),
            [theme.fn.smallerThan("sm")]: {
              "& > *": {
                flexGrow: 1,
                flexBasis: 0,
              },
            },
          }}
        >
          <Tabs.Tab
            value="event"
            color="lightblue"
            icon={<IconDiamond size={18} />}
            aria-label="Event scouts"
          >
            <Text weight={700}>Event{!isMobile && " Scouts"}</Text>
          </Tabs.Tab>
          <Tabs.Tab
            value="feature"
            color="yellow"
            icon={<IconComet size={18} />}
            aria-label="Feature Scouts"
          >
            <Text weight={700}>Feature{!isMobile && " Scouts"}</Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="event">
          <ResponsiveGrid
            width={200}
            {...(isMobile ? { mt: "xs" } : { ml: "xs" })}
          >
            {results
              .filter((scout) => scout.type === "scout")
              .map((scout: Scout) => (
                <ScoutCard
                  key={scout.gacha_id}
                  scout={scout}
                  bookmarked={bookmarks.includes(scout.gacha_id)}
                  bookmarks={bookmarks}
                  bookmarkHandlers={handlers}
                />
              ))}
          </ResponsiveGrid>
        </Tabs.Panel>

        <Tabs.Panel value="feature">
          <ResponsiveGrid
            width={200}
            {...(isMobile ? { mt: "xs" } : { ml: "xs" })}
          >
            {results
              .filter((scout) => scout.type === "feature scout")
              .map((scout: Scout) => (
                <ScoutCard
                  key={scout.gacha_id}
                  scout={scout}
                  bookmarked={bookmarks.includes(scout.gacha_id)}
                  bookmarks={bookmarks}
                  bookmarkHandlers={handlers}
                />
              ))}
          </ResponsiveGrid>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const getScouts: any = await getLocalizedDataArray<Scout>(
    "scouts",
    locale,
    "gacha_id"
  );

  const cardsQuery: any = await getLocalizedDataArray<GameCard>(
    "cards",
    locale,
    "id",
    ["id", "character_id", "rarity"]
  );

  const getCharacters: any = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id",
    ["character_id", "first_name", "sort_id"]
  );

  return {
    props: {
      scoutsQuery: getScouts,
      cardsQuery: cardsQuery,
      charactersQuery: getCharacters,
    },
  };
});

Page.getLayout = getLayout({ wide: true, hideOverflow: false });
export default Page;
