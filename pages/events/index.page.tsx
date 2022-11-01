import { Alert, Group, Paper, Text, TextInput } from "@mantine/core";
import { IconAlertCircle, IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";

import EventCard from "./components/EventCard";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import { retrieveEvents } from "services/events";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameEvent, GameUnit } from "types/game";

function Page({ events, units }: { events: GameEvent[]; units: GameUnit[] }) {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue(search, 200);
  const [filteredUnits, setFilteredUnits] = useState<GameUnit[]>([]);

  const [filteredEvents, setFilteredEvents] = useState<GameEvent[]>(events);

  useEffect(() => {
    // update events by search
    if (search === "" && filteredUnits.length === 0) setFilteredEvents(events);
    let filtered = events.filter((event) =>
      event.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [debouncedSearch]);

  return (
    <>
      <PageTitle title="Events" />
      <Alert icon={<IconAlertCircle size={16} />} color="indigo">
        In-game events are currently being added to MakoTools. We appreciate
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
