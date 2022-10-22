import { Badge, createStyles, Tooltip } from "@mantine/core";
import { NextLink } from "@mantine/next";

import {
  BirthdayEvent,
  GameEvent,
  GameEventStatus,
  ScoutEvent,
} from "types/game";

function CalendarEventCard({
  event,
  day,
  status,
}: {
  event: BirthdayEvent | GameEvent | ScoutEvent;
  day: string;
  status: GameEventStatus;
}) {
  const useStyles = createStyles((theme, _params, getRef) => ({
    eventCard: {
      fontSize: "12px",
      "&:hover": {
        cursor: "pointer",
      },
    },
  }));

  const { classes } = useStyles();
  return (
    <Tooltip
      multiline
      width={150}
      label={
        event.type === "song" || event.type === "tour"
          ? event.type + " event: " + event.name.toLowerCase()
          : event.type === "scout"
          ? event.type + "! " + event.name.toLowerCase()
          : event.type === "feature scout"
          ? event.type + ": " + event.name.toLowerCase()
          : event.name + "'s " + event.type
      }
      sx={{
        fontVariant: "small-caps",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      <Badge
        fullWidth
        variant="dot"
        color={
          event.type === "anniversary"
            ? "yellow"
            : event.type === "birthday"
            ? "cyan"
            : status === "start"
            ? "lime"
            : "pink"
        }
        className={classes.eventCard}
        component={NextLink}
        href={
          event.type === "birthday"
            ? `/characters/${(event as BirthdayEvent).character_id}`
            : (event as GameEvent).event_id
            ? `/events/${(event as GameEvent).event_id}`
            : `/scouts/${(event as ScoutEvent).gacha_id}`
        }
        sx={(theme) => ({
          borderRadius: theme.radius.sm,
          borderColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[3],
        })}
      >
        {event.type === "birthday"
          ? event.name.split(" ")[0] + "'s birthday"
          : event.type === "feature scout"
          ? status + ": " + event.name.split(" ")[0] + " FS"
          : event.type === "scout"
          ? status + ": SCOUT! " + event.name
          : event.type === "song" || event.type === "tour"
          ? status + ": " + event.story_name
          : event.name}
      </Badge>
    </Tooltip>
  );
}

export default CalendarEventCard;
