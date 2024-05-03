import { Card } from "@mantine/core";

import Picture from "components/core/Picture";
import { Event, Obtain, Scout } from "types/game";

export default function HowToObtain({
  obtain,
  obtainEvent,
}: {
  obtain: Obtain;
  obtainEvent: Event | Scout;
}) {
  return (
    <Card sx={{ display: "flex" }}>
      <Card.Section>Obtain via</Card.Section>
      <Card.Section sx={{ flexBasis: "30%" }}>
        <Picture
          srcB2={`assets/card_still_full1_${obtainEvent.banner_id}_evolution.png`}
          alt={obtainEvent?.name[0]}
        />
      </Card.Section>
    </Card>
  );
}
