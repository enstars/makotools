import { Paper, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons";

import EventCard from "./components/EventCard";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import { retrieveEvents } from "services/events";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameEvent } from "types/game";

function Page({ events }: { events: GameEvent[] }) {
  return (
    <>
      <PageTitle title="Events" />
      <Paper mb="sm" p="md" withBorder>
        <Text weight="700" size="xs" color="dimmed">
          <IconSearch size="1em" /> Search Options
        </Text>
      </Paper>
      {events.map((event) => (
        <EventCard key={event.event_id} event={event} />
      ))}
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const gameEvents: any = await getLocalizedDataArray<GameEvent>(
    "events",
    locale,
    "event_id"
  );

  const events: GameEvent[] = retrieveEvents(
    {
      gameEvents: gameEvents.data,
    },
    locale
  ) as GameEvent[];

  return {
    props: {
      events: events,
    },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
