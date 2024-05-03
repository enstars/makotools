import { Paper } from "@mantine/core";

import { Event, Obtain, Scout } from "types/game";

export default function HowToObtain({
  obtain,
  obtainEvent,
}: {
  obtain: Obtain;
  obtainEvent: Event | Scout | undefined;
}) {
  return <Paper>Obtain via</Paper>;
}
