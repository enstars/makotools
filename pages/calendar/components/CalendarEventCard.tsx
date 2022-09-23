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
    birthdayCardImage: {
      ref: getRef("image"),
      visibility: "hidden",
      height: "0vh",
      marginTop: "10%",
      transition: "height 0.5s, visibility 0.5s ease-in",
    },

    cardImageOverlay: {
      position: "absolute",
      width: "110%",
      height: "15vh",
      margin: "auto",
      marginLeft: "0.5vw",
      marginTop: "-7vh",
      background: `linear-gradient(${
        theme.colorScheme === "dark"
          ? theme.colors.blue[7]
          : theme.colors.blue[4]
      } 25%, transparent)`,
      zIndex: 1,
    },

    eventCard: {
      padding: "3px 0px 6px 0px !important",
      marginTop: "3px",
      textAlign: "left",
      color: theme.colors.gray[0],
      borderRadius: 0,
      transition: "border-radius 0.5s",
      "&:hover": {
        borderRadius: theme.radius.md,
        cursor: "pointer",
      },
      [`&:hover .${getRef("image")}`]: {
        visibility: "visible",
        height: "10vh",
      },
      background:
        theme.colorScheme === "dark"
          ? theme.colors.blue[7]
          : theme.colors.blue[4],
    },

    eventCardText: {
      padding: "0px 3px",
      display: "flex",
      flexFlow: "row wrap",
      alignItems: "flex-start",
      justifyContent: "space-evenly",
      maxWidth: "100%",
      margin: "auto",
      zIndex: 3,
    },
  }));

  const { event } = props;
  const { classes } = useStyles();
  return (
    <Card className={classes.eventCard}>
      <Link
        href={
          event.type === "birthday" || event.type === "feature scout"
            ? `/characters/${event.character_id}`
            : `/events/${event.event_id}`
        }
      >
        <Card.Section component="a" className={classes.eventCardText}>
          <Text sx={{ verticalAlign: "center", zIndex: 5 }}>
            {event.type === "birthday"
              ? event.character_name.split(" ")[0] + "'s birthday"
              : event.short_name + " " + event.status.toUpperCase()}
          </Text>
        </Card.Section>
      </Link>
      <Card.Section className={classes.birthdayCardImage}>
        <div className={classes.cardImageOverlay}></div>
        <Image
          src={getB2File(
            `assets/card_still_full1_${
              event.type === "birthday"
                ? event.character_render + "_normal"
                : event.five_star_id + "_evolution"
            }.webp`
          )}
          alt={event.character_name}
          width={500}
          sx={{
            position: "absolute",
            left: "-85%",
            top: "5%",
          }}
        />
      </Card.Section>
    </Card>
  );
}

export default CalendarEventCard;
