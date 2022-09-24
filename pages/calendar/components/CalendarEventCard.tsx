import Link from "next/link";
import {
  Badge,
  Card,
  Container,
  createStyles,
  Group,
  Image,
  Text,
} from "@mantine/core";
import { IconCake, IconPlayerPlay, IconPlayerStop } from "@tabler/icons";
import { useState } from "react";

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
    <Link
      href={
        event.type === "birthday" || event.type === "feature scout"
          ? `/characters/${event.id}`
          : `/events/${event.id}`
      }
      passHref
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
      >
        {event.type === "birthday"
          ? event.name.split(" ")[0] + "'s birthday"
          : event.type === "anniversary"
          ? event.name
          : event.status + ": " + event.short_name}
      </Badge>
    </Link>
  );
}

export default CalendarEventCard;
