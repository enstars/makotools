import Link from "next/link";
import { Card, Container, createStyles, Image, Text } from "@mantine/core";
import { IconCake } from "@tabler/icons";
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

    birthdayCardImageOverlay: {
      position: "absolute",
      width: "105%",
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
      background:
        theme.colorScheme === "dark"
          ? theme.colors.blue[7]
          : theme.colors.blue[4],
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
    },

    eventCardText: {
      padding: 0,
      display: "flex",
      flexFlow: "row nowrap",
      alignItems: "flex-start",
      justifyContent: "space-around",
      height: "16px",
      maxWidth: "100%",
      margin: "auto",
      zIndex: 3,
    },
  }));

  const { event } = props;
  const { classes } = useStyles();

  if (event.type === "birthday") {
    return (
      <Card className={classes.eventCard}>
        <Link href={`/characters/${event.character_id}`}>
          <Card.Section component="a" className={classes.eventCardText}>
            <IconCake size={16} style={{ zIndex: 5 }} />
            <Text
              sx={{ maxHeight: "100%", verticalAlign: "center", zIndex: 5 }}
            >
              {event.character_name}
            </Text>
          </Card.Section>
        </Link>
        <Card.Section className={classes.birthdayCardImage}>
          <div className={classes.birthdayCardImageOverlay}></div>
          <Image
            src={getB2File(
              `assets/card_still_full1_${event.character_render}_evolution.webp`
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
  } else {
    <></>;
  }
}

export default CalendarEventCard;
