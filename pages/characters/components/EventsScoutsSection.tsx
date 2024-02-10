import { Box, Title } from "@mantine/core";

import { EventScoutCard } from "./EventScoutCard";

import { GameCard, Event, Scout } from "types/game";
import { isGameEvent } from "services/utilities";
import ResponsiveGrid from "components/core/ResponsiveGrid";

export function EventsScoutsSection({
  events,
  cards,
}: {
  events: Event[] | Scout[];
  cards: GameCard[];
}) {
  return (
    <Box id="events">
      <Title
        order={4}
        size="h2"
        sx={{
          margin: "8vh 0px 4vh 0px",
        }}
      >
        {isGameEvent(events[0]) ? "Events" : "Scouts"}
      </Title>
      <ResponsiveGrid width={240}>
        {events.map((event) => {
          const correspondingCard = cards.filter((card) =>
            event.cards.includes(card.id)
          )[0];
          return (
            <EventScoutCard
              key={isGameEvent(event) ? event.event_id : event.gacha_id}
              event={event}
              card={correspondingCard}
            />
          );
        })}
      </ResponsiveGrid>
    </Box>
  );
}
