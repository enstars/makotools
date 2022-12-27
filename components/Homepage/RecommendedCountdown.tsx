import { Container, Paper, Text, Title, useMantineTheme } from "@mantine/core";
import Link from "next/link";

import { retrieveClosestEvents } from "services/events";
import useUser from "services/firebase/user";
import { BirthdayEvent, GameEvent, ScoutEvent } from "types/game";

function RecommendedCard() {}

function RecommendedCountdown({
  events,
}: {
  events: (GameEvent | ScoutEvent | BirthdayEvent)[];
}) {
  const user = useUser();
  const theme = useMantineTheme();
  return (
    <Container my="3vh">
      <Title order={2}>Recommended Campaigns</Title>
      {user.loggedIn &&
      user.db &&
      (!user.db.profile__fave_charas ||
        user.db.profile__fave_charas.length === 0) ? (
        <Paper p={5} my={10}>
          <Text>
            There are no recommended campaigns available. Perhaps you should add
            your favorite characters to{" "}
            <Text
              color={theme.colors[theme.primaryColor][4]}
              component={Link}
              href={`/@${user.db.username}`}
            >
              your profile
            </Text>
            !
          </Text>
        </Paper>
      ) : events.length === 0 ? (
        <Text>There are no upcoming recommended campaigns available.</Text>
      ) : (
        retrieveClosestEvents(events, 5).map((e, i) => (
          <Text key={i}>
            {typeof e.name === "string" ? `${e.name}'s Birthday` : e.name[0]}
          </Text>
        ))
      )}
    </Container>
  );
}

export default RecommendedCountdown;
