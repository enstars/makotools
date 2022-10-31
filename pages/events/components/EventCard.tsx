import {
  Box,
  createStyles,
  Paper,
  Title,
  Text,
  Badge,
  Group,
  Blockquote,
} from "@mantine/core";
import Link from "next/link";
import { IconBus, IconDiamond } from "@tabler/icons";

import Picture from "components/core/Picture";
import { GameEvent } from "types/game";
import { useDayjs } from "services/libraries/dayjs";

const useStyles = createStyles((theme, _params, getRef) => ({
  eventCard: {
    display: "flex",
    width: "80%",
    margin: "auto",
    marginTop: "2vh",
  },
  eventInfo: {
    flex: "2 1 100px",
    padding: "10px",
  },
  eventDate: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },
  eventSummary: {
    fontSize: "11pt",
  },
}));

function EventCard({ event }: { event: GameEvent }) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();

  return (
    <Paper
      component={Link}
      href={`/events/${event.event_id}`}
      shadow="xs"
      withBorder
      className={classes.eventCard}
    >
      <Box sx={{ position: "relative", flex: "1 1 100px" }}>
        <Picture
          alt={event.name}
          srcB2={`assets/card_still_full1_${event.banner_id}_evolution.png`}
          sx={{ height: 200 }}
        />
      </Box>
      <Box className={classes.eventInfo}>
        <Group noWrap>
          <Title order={3} sx={{ width: "80%" }}>
            {event.name}
          </Title>
          <Badge
            variant="filled"
            color={event.type === "song" ? "grape" : "teal"}
            leftSection={
              <Box mt={4}>
                {event.type === "song" ? (
                  <IconDiamond size={12} strokeWidth={3} />
                ) : (
                  <IconBus size={12} strokeWidth={3} />
                )}
              </Box>
            }
          >
            {event.type}
          </Badge>
        </Group>
        <Text size="sm" className={classes.eventDate}>
          {dayjs(event.start_date).format("lll")}
          {" - "}
          {dayjs(event.end_date).format("lll z")}
        </Text>
        <Blockquote className={classes.eventSummary}>
          {event.intro_lines || "Event description to be announced soon."}
        </Blockquote>
      </Box>
    </Paper>
  );
}

export default EventCard;
