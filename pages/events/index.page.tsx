import {
  ActionIcon,
  Alert,
  Group,
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
import { useEffect, useState } from "react";
import { useDebouncedValue, useLocalStorage } from "@mantine/hooks";

import EventCard from "./components/EventCard";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import { retrieveEvents } from "services/events";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameEvent, GameUnit } from "types/game";

type SortOption = "date" | "id";

interface EventViewOptions {
  searchQuery: string;
  sortOption: SortOption;
  sortDescending: boolean;
}

function Page({ events, units }: { events: GameEvent[]; units: GameUnit[] }) {
  const EVENT_VIEW_OPTIONS_DEFAULT: EventViewOptions = {
    searchQuery: "",
    sortOption: "id",
    sortDescending: false,
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
    },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
