import {
  ActionIcon,
  Alert,
  Button,
  Group,
  MultiSelect,
  Paper,
  Select,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowsSort,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons";
import { useMemo } from "react";
import dayjs from "dayjs";

import EventCard from "./components/EventCard";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import { retrieveEvents } from "services/events";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameCharacter, GameEvent, GameUnit } from "types/game";
import { QuerySuccess } from "types/makotools";
import useFSSList from "services/makotools/search";

const defaultView = {
  filters: { units: [] },
  search: "",
  sort: {
    type: "id",
    ascending: true,
  },
};

function Page({
  events,
  units,
  locale,
  charactersQuery,
}: {
  events: GameEvent[];
  units: GameUnit[];
  locale: string[];
  charactersQuery: QuerySuccess<GameCharacter[]>;
}) {
  const characters = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const fssOptions = useMemo<FSSOptions<GameEvent>>(
    () => ({
      filters: [
        {
          type: "units",
          values: [],
          function: (view) => {
            // return (c) =>
            //   view.filters.units.filter((value: number) =>
            //     c.unit_id?.includes(value)
            //   ).length;

            // this mess below can be removed when we can confirm
            // event's unit_id is ALWAYS an array of numbers

            return (c) =>
              view.filters.units.filter((value: number) =>
                Array.isArray(c.unit_id)
                  ? c.unit_id?.includes(value)
                  : c.unit_id === value
              ).length;
          },
        },
      ],
      sorts: [
        {
          label: "Event ID",
          value: "id",
          function: (a, b) => a.event_id - b.event_id,
        },
        {
          label: "Start Date",
          value: "date",
          function: (a, b) =>
            dayjs(a.start_date).unix() - dayjs(b.start_date).unix(),
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
  const { results, view, setView } = useFSSList<GameEvent>(events, fssOptions);

  let characterIDtoSort: { [key: number]: number } = {};
  characters.forEach((c) => {
    characterIDtoSort[c.character_id] = c.sort_id;
  });

  return (
    <>
      <PageTitle title="Events" />
      <Alert icon={<IconAlertCircle size={16} />} color="indigo">
        In-game events are gradually being added to MakoTools. We appreciate
        your patience!
      </Alert>
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
                  color="blue"
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
                  units: val.map(parseInt),
                },
              }));
            }}
          />
          {/* <MultiSelect
            label="Character 5★"
            placeholder="Pick a character..."
            data={characters
              .sort(
                (a: any, b: any) =>
                  characterIDtoSort[a.character_id] -
                  characterIDtoSort[b.character_id]
              )
              .map((c: GameCharacter) => {
                return {
                  value: c.character_id.toString(),
                  label: c.first_name[0],
                };
              })}
            value={viewOptions.filterFiveStar}
            onChange={(val) => {
              setViewOptions({ ...viewOptions, filterFiveStar: val });
            }}
            sx={{ maxWidth: 400 }}
            variant="default"
            searchable
          />
          <MultiSelect
            label="Character 4★"
            placeholder="Pick a character..."
            data={characters
              .sort(
                (a: any, b: any) =>
                  characterIDtoSort[a.character_id] -
                  characterIDtoSort[b.character_id]
              )
              .map((c: GameCharacter) => {
                return {
                  value: c.character_id.toString(),
                  label: c.first_name[0],
                };
              })}
            value={viewOptions.filterFourStar}
            onChange={(val) => {
              setViewOptions({ ...viewOptions, filterFourStar: val });
            }}
            sx={{ maxWidth: 400 }}
            variant="default"
            searchable
          />
          <Input.Wrapper id="type" label="Event Type">
            <Chip.Group
              multiple
              value={viewOptions.filterType}
              onChange={(value) => {
                const filterType = value;
                setViewOptions({ ...viewOptions, filterType });
              }}
              spacing={3}
            >
              {["Song", "Tour", "Special", "Shuffle"].map((r) => (
                <Chip
                  key={r}
                  value={r.toString()}
                  radius="md"
                  styles={{
                    label: { paddingLeft: 10, paddingRight: 10 },
                    iconWrapper: { display: "none" },
                  }}
                  color="yellow"
                  variant="filled"
                >
                  {r}
                </Chip>
              ))}
            </Chip.Group>
          </Input.Wrapper> */}
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
      {results.map((event) => {
        let eventUnits: GameUnit[] = units.filter((unit: GameUnit) => {
          return event.unit_id
            ? (event.unit_id as number[]).includes(unit.id)
            : false;
        });
        return (
          <EventCard
            key={event.event_id}
            event={event}
            units={eventUnits}
            locale={locale[0]}
          />
        );
      })}
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const getEvents: any = await getLocalizedDataArray<any>(
    "events",
    locale,
    "event_id"
  );

  const getCharacters: any = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id",
    ["character_id", "first_name", "sort_id"]
  );

  const getUnits: any = await getLocalizedDataArray<GameUnit>(
    "units",
    locale,
    "id"
  );

  const events: GameEvent[] = retrieveEvents(
    {
      gameEvents: getEvents.data,
    },
    locale
  ) as GameEvent[];

  return {
    props: {
      events: events,
      units: getUnits.data,
      locale: locale,
      charactersQuery: getCharacters,
    },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
