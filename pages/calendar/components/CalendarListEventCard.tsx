import {
  Box,
  createStyles,
  Group,
  Image,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import {
  IconCake,
  IconExclamationMark,
  IconPlayerPlay,
  IconStar,
} from "@tabler/icons";
import { useEffect, useState } from "react";

import { getAssetURL } from "services/data";
import {
  BirthdayEvent,
  GameEvent,
  GameEventStatus,
  ScoutEvent,
} from "types/game";

const useStyles = createStyles((theme, _params, getRef) => ({
  listCardImg: {
    ref: getRef("image"),
    display: "block",
    width: "100%",
    height: "100%",
    border: `2px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1]
    }`,
    borderRadius: theme.radius.md,
    zIndex: -1,
    overflow: "clip",
  },

  listCardStatus: {
    ref: getRef("status"),
    display: "block",
    position: "absolute",
    zIndex: 1,
    width: "auto",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[2]
        : theme.colors.gray[8],
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[8]
        : theme.colors.gray[1],
    padding: "0.5vh 1vw",
    borderRadius: `${theme.radius.md}px  0px ${theme.radius.md}px 0px`,
    textAlign: "left",
    textTransform: "uppercase",
    transition: "visibility",
  },

  listCardName: {
    ref: getRef("name"),
    display: "block",
    position: "absolute",
    right: 0,
    bottom: 0,
    zIndex: 2,
    width: "auto",
    maxWidth: "95%",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[8]
        : theme.colors.gray[1],
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[2]
        : theme.colors.gray[8],
    padding: "1vh 1vw",
    borderRadius: `${theme.radius.md}px 0px ${theme.radius.md}px 0px`,
    textAlign: "right",
    transition: "width, height, border-radius",

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      marginBottom: "-2vh",
    },
  },

  listCard: {
    display: "block",
    position: "relative",
    width: "100%",
    height: "20%",

    [`&:not(:first-of-type)`]: {
      marginTop: "5vh",
    },
  },
}));

function CalendarListEventCard({
  index,
  eventsAmt,
  event,
  status,
}: {
  index: number;
  eventsAmt: number;
  event: BirthdayEvent | GameEvent | ScoutEvent;
  status: GameEventStatus;
}) {
  const { classes } = useStyles();

  const [isMobile, setMobile] = useState<boolean>(true);

  useEffect(() => {
    window.innerWidth < 900 ? setMobile(true) : setMobile(false);
  }, []);

  return (
    <Box
      component={NextLink}
      className={classes.listCard}
      href={
        event.type === "birthday"
          ? `/characters/${(event as BirthdayEvent).character_id}`
          : (event as GameEvent).event_id
          ? `/events/${(event as GameEvent).event_id}`
          : `/scouts/${(event as ScoutEvent).gacha_id}`
      }
    >
      <Box className={classes.listCardStatus}>
        <Group spacing="xs">
          <ThemeIcon
            variant="light"
            radius="xl"
            color={
              event.type === "birthday"
                ? "cyan"
                : event.type === "anniversary"
                ? "yellow"
                : status === "start"
                ? "lime"
                : "pink"
            }
          >
            {event.type === "birthday" ? (
              <IconCake size={16} />
            ) : event.type === "anniversary" ? (
              <IconStar size={16} />
            ) : status === "start" ? (
              <IconPlayerPlay size={16} />
            ) : (
              <IconExclamationMark size={16} />
            )}
          </ThemeIcon>
          <Text weight={700} size="sm">
            {event.type === "birthday"
              ? "Birthday"
              : event.type === "anniversary"
              ? "Anniversary"
              : status === "start"
              ? "Start"
              : "End"}
          </Text>
        </Group>
      </Box>
      <Box className={classes.listCardName}>
        <Text weight={600} size="lg">
          {event.type === "birthday"
            ? event.name + "'s Birthday"
            : event.type === "scout"
            ? "SCOUT! " + event.name
            : event.type === "feature scout"
            ? "Featured Scout: " + event.name.split(" ")[0]
            : event.name}
        </Text>
      </Box>
      <Image
        src={getAssetURL(
          `assets/card_still_full1_${
            event.type === "birthday"
              ? event.banner_id + "_normal"
              : event.banner_id + "_evolution"
          }.webp`
        )}
        alt={event.name}
        radius="md"
        className={classes.listCardImg}
        height={150}
        sx={{ marginTop: "-2vh" }}
      />
    </Box>
  );
}

export default CalendarListEventCard;
