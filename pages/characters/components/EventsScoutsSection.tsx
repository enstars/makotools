import { Box, Title } from "@mantine/core";

import { EventScoutCard } from "./EventScoutCard";

import { GameCard, Event, Scout } from "types/game";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import { useCharacterColors } from "../[id].page";
import SectionTitle from "pages/events/components/SectionTitle";
import { IconAward, IconDiamond } from "@tabler/icons-react";

export function EventsScoutsSection({
  events,
  cards,
  type,
}: {
  events: Event[] | Scout[];
  cards: GameCard[];
  type: "events" | "scouts";
}) {
  const colors = useCharacterColors();
  return (
    <Box>
      <SectionTitle
        id={type === "events" ? "events" : "scouts"}
        title={type === "events" ? "Events" : "Scouts"}
        Icon={type === "events" ? IconAward : IconDiamond}
        iconProps={{ color: colors.image }}
      />
      <ResponsiveGrid width={240}>
        {events.map((event) => {
          const correspondingCard = cards.filter((card) =>
            event.cards.includes(card.id)
          )[0];
          return (
            <EventScoutCard
              key={type === "events" ? event.event_id : event.gacha_id}
              event={event}
              card={correspondingCard}
            />
          );
        })}
      </ResponsiveGrid>
    </Box>
  );
}
