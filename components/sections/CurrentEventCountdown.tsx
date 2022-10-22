import { Container, Title } from "@mantine/core";

import { GameEvent } from "types/game";

function CurrentEventCountdown({ events }: { events: GameEvent[] }) {
  return (
    <Container>
      <Title order={2}>Current Event</Title>
    </Container>
  );
}

export default CurrentEventCountdown;
