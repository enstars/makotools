import Link from "next/link";
import { Badge, createStyles, Tooltip } from "@mantine/core";
import { IconCake, IconPlayerPlay, IconPlayerStop } from "@tabler/icons";
import { useState } from "react";
import { NextLink } from "@mantine/next";

import { getB2File } from "../../../services/ensquare";
import { twoStarIDs } from "../../../data/characterIDtoCardID";

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
      label={
        event.type === "song" || event.type === "tour"
          ? event.type + " event"
          : event.type
      }
      sx={{ fontVariant: "small-caps", fontWeight: "bold" }}
    >
      <Badge
        fullWidth
        variant="dot"
        color={
          event.type === "anniversary"
            ? "yellow"
            : event.type === "birthday"
            ? "cyan"
            : event.status === "start"
            ? "lime"
            : "pink"
        }
        className={classes.eventCard}
        component={NextLink}
        href={
          event.type === "birthday" || event.type === "feature scout"
            ? `/characters/${event.id}`
            : `/events/${event.id}`
        }
      >
        {event.type === "birthday"
          ? event.name.split(" ")[0] + "'s birthday"
          : event.type === "feature scout"
          ? event.status + ": " + event.name.split(" ")[0] + " FS"
          : event.type === "scout"
          ? event.status + ": " + event.name
          : event.type === "song" || event.type === "tour"
          ? event.status + ": " + event.short_name
          : event.name}
      </Badge>
    </Tooltip>
  );
}

export default CalendarEventCard;
