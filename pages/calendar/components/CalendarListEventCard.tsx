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
      marginBottom: "-1vh",
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

function CalendarListEventCard({ ...props }) {
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
        props.event.type === "birthday"
          ? `/characters/${props.event.id}`
          : `/events/${props.event.id}`
      }
    >
      <Box className={classes.listCardStatus}>
        <Group spacing="xs">
          <ThemeIcon
            variant="light"
            radius="xl"
            color={
              props.event.type === "birthday"
                ? "cyan"
                : props.event.type === "anniversary"
                ? "yellow"
                : props.event.status === "start"
                ? "lime"
                : "pink"
            }
          >
            {props.event.type === "birthday" ? (
              <IconCake size={16} />
            ) : props.event.type === "anniversary" ? (
              <IconStar size={16} />
            ) : props.event.status === "start" ? (
              <IconPlayerPlay size={16} />
            ) : (
              <IconExclamationMark size={16} />
            )}
          </ThemeIcon>
          <Text weight={700} size="sm">
            {props.event.type === "birthday"
              ? "Birthday"
              : props.event.type === "anniversary"
              ? "Anniversary"
              : props.event.status === "start"
              ? "Start"
              : "End"}
          </Text>
        </Group>
      </Box>
      <Box className={classes.listCardName}>
        <Text weight={600} size="lg">
          {props.event.type === "birthday"
            ? props.event.name + "'s Birthday"
            : props.event.type === "scout"
            ? "SCOUT! " + props.event.name
            : props.event.type === "feature scout"
            ? "Featured Scout: " + props.event.name.split(" ")[0]
            : props.event.name}
        </Text>
      </Box>
      <Image
        src={getAssetURL(
          `assets/card_still_full1_${
            props.event.type === "birthday"
              ? props.event.render_id + "_normal"
              : props.event.render_id + "_evolution"
          }.webp`
        )}
        alt={props.event.name}
        radius="md"
        className={classes.listCardImg}
        height={150}
        sx={{ marginTop: "-2vh" }}
      />
    </Box>
  );
}

export default CalendarListEventCard;
