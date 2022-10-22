import { Badge, createStyles, Tooltip } from "@mantine/core";
import { NextLink } from "@mantine/next";

function CalendarEventCard({ ...props }) {
  const useStyles = createStyles((theme, _params, getRef) => ({
    eventCard: {
      fontSize: "12px",
      "&:hover": {
        cursor: "pointer",
      },
    },
  }));

  const { event } = props;
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
            : props.status === "start"
            ? "lime"
            : "pink"
        }
        className={classes.eventCard}
        component={NextLink}
        href={
          event.type === "birthday"
            ? `/characters/${event.character_id}`
            : event.event_id
            ? `/events/${event.event_id}`
            : `/scouts/${event.gacha_id}`
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
          ? props.status + ": " + event.name.split(" ")[0] + " FS"
          : event.type === "scout"
          ? props.status + ": SCOUT! " + event.name
          : event.type === "song" || event.type === "tour"
          ? props.status + ": " + event.story_name
          : event.name}
      </Badge>
    </Tooltip>
  );
}

export default CalendarEventCard;
