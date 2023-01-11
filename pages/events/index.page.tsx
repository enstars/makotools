import {
  ActionIcon,
  Button,
  Chip,
  Group,
  Input,
  MultiSelect,
  Paper,
  Select,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowsSort,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons";
import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useListState } from "@mantine/hooks";

import EventCard from "./components/EventCard";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameCard, GameCharacter, Event, GameUnit } from "types/game";
import { QuerySuccess, UserLoggedIn } from "types/makotools";
import useFSSList from "services/makotools/search";
import useUser from "services/firebase/user";

const defaultView = {
  filters: {
    units: [] as number[],
    characters: [] as number[],
    types: [] as string[],
  },
  search: "",
  sort: {
    type: "id",
    ascending: true,
  },
};

function Page({
  eventsQuery,
  cardsQuery,
  unitsQuery,
  charactersQuery,
}: {
  eventsQuery: QuerySuccess<Event[]>;
  cardsQuery: QuerySuccess<GameCard[]>;
  unitsQuery: QuerySuccess<GameUnit[]>;
  charactersQuery: QuerySuccess<GameCharacter[]>;
}) {
  const user = useUser();
  const theme = useMantineTheme();
  const { locale } = useRouter();
  const events = useMemo(() => eventsQuery.data, [eventsQuery.data]);
  const cards = useMemo(() => cardsQuery.data, [cardsQuery.data]);
  const units = useMemo(() => unitsQuery.data, [unitsQuery.data]);
  const characters = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const fssOptions = useMemo<FSSOptions<Event, typeof defaultView.filters>>(
    () => ({
      filters: [
        {
          type: "units",
          values: [],
          function: (view) => {
            return (c: Event) =>
              view.filters.units.filter((value) => c.unit_id?.includes(value))
                .length === view.filters.units.length;
          },
        },
        {
          type: "characters",
          values: [],
          function: (view) => {
            return (c: Event) =>
              view.filters.characters.filter((value: number) => {
                return cards
                  .filter((card) => c.cards?.includes(card.id))
                  .map((card) => card.character_id)
                  .includes(value);
              }).length > 0;
          },
        },
        {
          type: "types",
          values: [],
          function: (view) => {
            return (c) => view.filters.types.includes(c.type);
          },
        },
      ],
      sorts: [
        {
          label: "Event ID",
          value: "id",
          function: (a: Event, b: Event) => a.event_id - b.event_id,
        },
        {
          label: "Start Date",
          value: "date",
          function: (a: Event, b: Event) =>
            dayjs(a.start.en).unix() - dayjs(b.start.en).unix(),
        },
      ],
      baseSort: "id",
      search: {
        fields: ["name"],
      },
      defaultView,
    }),
    []
  );
  const { results, view, setView } = useFSSList<
    Event,
    typeof defaultView.filters
  >(events, fssOptions);
  const [bookmarks, handlers] = useListState<number>(
    (user as UserLoggedIn).db.bookmarks__events || []
  );

  let characterIDtoSort: { [key: number]: number } = {};
  characters.forEach((c) => {
    characterIDtoSort[c.character_id] = c.sort_id;
  });

  useEffect(() => {
    user.loggedIn &&
      user.db.set({
        bookmarks__events: bookmarks,
      });
  }, [bookmarks]);

  return (
    <>
      <PageTitle title="Events" />
      <Paper mb="sm" p="md" withBorder sx={{ marginTop: "1vh" }}>
        <Text weight="700" size="xs" color="dimmed">
          <IconSearch size="1em" /> Search Options
        </Text>
        <Group>
          <TextInput
            label="Search"
            placeholder="Type an event name..."
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
                  color={theme.primaryColor}
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
            label="Featured Units"
            placeholder="Pick a unit..."
            data={units
              .sort((a: GameUnit, b: GameUnit) => a.id - b.id)
              .map((unit) => {
                return {
                  value: unit.id.toString(),
                  label: unit.name[0],
                };
              })}
            variant="default"
            searchable
            onChange={(val) => {
              setView((v) => ({
                ...v,
                filters: {
                  ...v.filters,
                  units: val.map((u) => parseInt(u)),
                },
              }));
            }}
            value={view.filters.units.map((u) => u.toString())}
          />
          <MultiSelect
            label="Featured Characters"
            placeholder="Pick a character..."
            data={characters
              .sort((a, b) => a.sort_id - b.sort_id)
              .map((c: GameCharacter) => {
                return {
                  value: c.character_id.toString(),
                  label: c.first_name[0],
                };
              })}
            value={view.filters.characters.map((u) => u.toString())}
            onChange={(val) => {
              setView((v) => ({
                ...v,
                filters: {
                  ...v.filters,
                  characters: val.map((u) => parseInt(u)),
                },
              }));
            }}
            sx={{ maxWidth: 400 }}
            variant="default"
            searchable
          />
          <Input.Wrapper id="type" label="Event Type">
            <Chip.Group
              multiple
              value={view.filters.types}
              onChange={(val) => {
                setView((v) => ({
                  ...v,
                  filters: {
                    ...v.filters,
                    types: val,
                  },
                }));
              }}
              spacing={3}
            >
              {[
                { value: "song", label: "Unit Song" },
                { value: "tour", label: "Tour" },
                { value: "shuffle", label: "Shuffle" },
              ].map((r) => (
                <Chip
                  key={r.value}
                  value={r.value}
                  radius="md"
                  styles={{
                    label: { paddingLeft: 10, paddingRight: 10 },
                  }}
                  variant="filled"
                >
                  {r.label}
                </Chip>
              ))}
            </Chip.Group>
          </Input.Wrapper>
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
      {results.map((event) => (
        <EventCard
          key={event.event_id}
          event={event}
          units={units}
          bookmarked={bookmarks.includes(event.event_id)}
          bookmarks={bookmarks}
          bookmarkHandlers={handlers}
        />
      ))}
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const eventsQuery: any = await getLocalizedDataArray<Event>(
    "events",
    locale,
    "event_id"
  );

  const cardsQuery: any = await getLocalizedDataArray<GameCard>(
    "cards",
    locale,
    "id",
    ["id", "character_id", "rarity"]
  );

  const charactersQuery: any = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id",
    ["character_id", "first_name", "sort_id"]
  );

  const unitsQuery: any = await getLocalizedDataArray<GameUnit>(
    "units",
    locale,
    "id"
  );

  // const events: Event[] = retrieveEvents(
  //   {
  //     gameEvents: getEvents.data,
  //   },
  //   locale
  // ) as Event[];

  return {
    props: {
      eventsQuery,
      cardsQuery,
      unitsQuery,
      charactersQuery,
    },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
