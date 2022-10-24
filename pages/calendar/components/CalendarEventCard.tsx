import { Badge, Box, createStyles, Tooltip } from "@mantine/core";
import { NextLink } from "@mantine/next";
import {
  IconCake,
  IconExclamationMark,
  IconPlayerPlay,
  IconStar,
} from "@tabler/icons";

import {
  BirthdayEvent,
  GameEvent,
  GameEventStatus,
  ScoutEvent,
} from "types/game";

const useStyles = createStyles((theme, _params, getRef) => ({
  eventCard: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));
function CalendarEventCard({
  event,
  status,
}: {
  event: BirthdayEvent | GameEvent | ScoutEvent;
  status: GameEventStatus;
}) {
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
        // fontVariant: "small-caps",
        fontWeight: "bold",
        textAlign: "center",
      }}
      withinPortal={true}
    >
      <Badge
        px={2}
        fullWidth
        variant="filled"
        color={
          event.type === "anniversary"
            ? "yellow"
            : event.type === "birthday"
            ? "cyan"
            : event.type === "feature scout"
            ? "lightblue"
            : event.type === "scout"
            ? "violet"
            : "yellow"
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
          borderWidth: 0,
          borderLeft:
            status === "start"
              ? `solid ${theme.radius.sm}px ${theme.colors.green[5]}`
              : undefined,
          borderRight:
            status === "end"
              ? `solid ${theme.radius.sm}px ${theme.colors.pink[5]}`
              : undefined,
        })}
        leftSection={
          <Box mt={4}>
            {event.type === "birthday" ? (
              <IconCake size={12} strokeWidth={3} />
            ) : event.type === "anniversary" ? (
              <IconStar size={12} strokeWidth={3} />
            ) : status === "start" ? (
              <IconPlayerPlay size={12} strokeWidth={3} />
            ) : (
              <IconExclamationMark size={12} strokeWidth={3} />
            )}
          </Box>
        }
      >
        {event.type === "birthday"
          ? event.name.split(" ")[0] + "'s birthday"
          : event.type === "feature scout"
          ? event.name.split(" ")[0] + " FS"
          : event.type === "scout"
          ? "SC! " + event.name
          : event.type === "song" || event.type === "tour"
          ? event.story_name
          : event.name}
      </Badge>
    </Tooltip>
  );
}

export default CalendarEventCard;
