import {
  ActionIcon,
  Alert,
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
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowsSort,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue, useLocalStorage } from "@mantine/hooks";

import EventCard from "./components/EventCard";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import { retrieveEvents } from "services/events";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameCharacter, GameEvent, GameUnit } from "types/game";
import { QuerySuccess } from "types/makotools";

type SortOption = "date" | "id";

interface EventViewOptions {
  searchQuery: string;
  sortOption: SortOption;
  sortDescending: boolean;
  filterUnits: string[];
  filterFiveStar: string[];
  filterFourStar: string[];
  filterType: string[];
}

function Page({
  events,
  units,
  charactersQuery,
}: {
  events: GameEvent[];
  units: GameUnit[];
  charactersQuery: QuerySuccess<GameCharacter[]>;
}) {
  const characters = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const EVENT_VIEW_OPTIONS_DEFAULT: EventViewOptions = {
    searchQuery: "",
    sortOption: "id",
    sortDescending: false,
    filterUnits: [],
    filterFiveStar: [],
    filterFourStar: [],
    filterType: [],
  };

  const [viewOptions, setViewOptions] = useLocalStorage<EventViewOptions>({
    key: "eventFilters",
    defaultValue: EVENT_VIEW_OPTIONS_DEFAULT,
  });
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue(search, 200);
  const [filteredUnits, setFilteredUnits] = useState<GameUnit[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<GameEvent[]>(events);

  const descending = viewOptions.sortDescending ? -1 : 1;
  const SORT_FUNCTIONS = {
    id: (a: any, b: any) => (a.id - b.id) * descending,
    date: (a: any, b: any) =>
      (Date.parse(a.start_date) - Date.parse(b.start_date)) * descending,
  };

  let characterIDtoSort: { [key: number]: number } = {};
  characters.forEach((c) => {
    characterIDtoSort[c.character_id] = c.sort_id;
  });

  useEffect(() => {
    // update events by search
    let filtered =
      search === ""
        ? events
        : events.filter((event) =>
            event.name.toLowerCase().includes(search.toLowerCase())
          );
    filtered
      .sort(SORT_FUNCTIONS["id"])
      .sort(SORT_FUNCTIONS[viewOptions.sortOption]);
    let sortedEvents = setFilteredEvents(filtered);
  }, [viewOptions, debouncedSearch]);

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "id", label: "Event ID" },
    { value: "date", label: "Start date" },
  ];

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
          <Group>
            <TextInput
              label="Search"
              placeholder="Type an event name..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              sx={{ maxWidth: 200 }}
              variant="default"
              icon={<IconSearch size="1em" />}
            />
            <Select
              label="Sort by"
              placeholder="Select sorting option..."
              data={SORT_OPTIONS}
              value={viewOptions.sortOption}
              onChange={(value: SortOption) => {
                if (value)
                  setViewOptions({ ...viewOptions, sortOption: value });
              }}
              sx={{ maxWidth: 200 }}
              variant="default"
              icon={<IconArrowsSort size="1em" />}
              rightSection={
                <Tooltip label="Toggle ascending/descending">
                  <ActionIcon
                    onClick={() => {
                      setViewOptions((v) => ({
                        ...viewOptions,
                        sortDescending: !v.sortDescending,
                      }));
                    }}
                    variant="light"
                    color="blue"
                  >
                    {viewOptions.sortDescending ? (
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
            />
            <MultiSelect
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
            </Input.Wrapper>
            <Button
              compact
              onClick={() => {
                setViewOptions(EVENT_VIEW_OPTIONS_DEFAULT);
              }}
            >
              Reset all filters
            </Button>
          </Group>
        </Text>
      </Paper>
      {filteredEvents.map((event) => {
        let eventUnits: GameUnit[] = units.filter((unit: GameUnit) => {
          return event.unit_id
            ? (event.unit_id as number[]).includes(unit.id)
            : false;
        });
        console.log(eventUnits);
        return (
          <EventCard key={event.event_id} event={event} units={eventUnits} />
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
      charactersQuery: getCharacters,
    },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
