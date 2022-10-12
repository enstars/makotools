import { Badge, Card, createStyles, Group, Image, Text } from "@mantine/core";
import { NextLink } from "@mantine/next";
import {
  IconAlertCircle,
  IconCake,
  IconPlayerPlay,
  IconStar,
} from "@tabler/icons";
import { useEffect, useState } from "react";

import { getAssetURL } from "../../../services/data";

const useStyles = createStyles((theme, _params, getRef) => ({
  listEventCard: {
    margin: "auto",
    marginTop: "1vh",

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      width: "100%",
    },

    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
      width: "80%",
    },
  },
  listEventCardImage: {
    minWidth: "100%",
    height: "120px",
    overflow: "clip",
  },
  listEventCardText: {
    margin: 0,

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      padding: "4vh 1vw",
    },

    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
      padding: "2vh 1vw",
    },
  },
}));

function CalendarListEventCard({ ...props }) {
  const { classes } = useStyles();

  const [isMobile, setMobile] = useState<boolean>(true);

  useEffect(() => {
    window.innerWidth < 900 ? setMobile(true) : setMobile(false);
  }, []);
  return (
    <Card
      component={NextLink}
      href={
        props.event.type === "birthday" || props.event.type === "feature scout"
          ? `/characters/${props.event.id}`
          : `/events/${props.event.id}`
      }
      withBorder
      className={classes.listEventCard}
    >
      <Card.Section className={classes.listEventCardImage}>
        <Image
          src={getAssetURL(
            `assets/card_still_full1_${
              props.event.type === "birthday"
                ? props.event.render_id + "_normal"
                : props.event.render_id + "_evolution"
            }.webp`
          )}
          alt={props.event.name}
          sx={{ zIndex: -1 }}
        />
      </Card.Section>
      <Card.Section className={classes.listEventCardText}>
        <Group noWrap={!isMobile}>
          <Badge
            fullWidth
            color={
              props.event.type === "birthday"
                ? "cyan"
                : props.event.type === "anniversary"
                ? "yellow"
                : props.event.status === "start"
                ? "lime"
                : "pink"
            }
            leftSection={
              props.event.type === "birthday" ? (
                <IconCake size={16} style={{ marginTop: "3px" }} />
              ) : props.event.type === "anniversary" ? (
                <IconStar size={16} style={{ marginTop: "3px" }} />
              ) : props.event.status === "start" ? (
                <IconPlayerPlay size={16} style={{ marginTop: "3px" }} />
              ) : (
                <IconAlertCircle size={17} style={{ marginTop: "4px" }} />
              )
            }
            sx={{
              display: "flex inline",
              alignItems: "center",
              minWidth: "75px",
              maxWidth: "90px",
            }}
          >
            {props.event.type === "birthday"
              ? "Birth"
              : props.event.type === "anniversary"
              ? "Anni"
              : props.event.status === "start"
              ? "Start"
              : "End"}
          </Badge>
          <Text size={isMobile ? "md" : "lg"} weight={600} lineClamp={4}>
            {props.event.type === "birthday"
              ? props.event.name + "'s Birthday"
              : props.event.type === "scout"
              ? "SCOUT! " + props.event.name
              : props.event.type === "feature scout"
              ? "Featured Scout: " + props.event.name.split(" ")[0]
              : props.event.name}
          </Text>
        </Group>
      </Card.Section>
    </Card>
  );
}

export default CalendarListEventCard;
