import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";
import { Box, Button, createStyles, Stack, Text, Title } from "@mantine/core";
import { NextLink } from "@mantine/next";

import { BirthdayEvent, GameEvent, ScoutEvent } from "types/game";
import { useDayjs } from "services/libraries/dayjs";
import Picture from "components/core/Picture";
import { CONSTANTS } from "services/makotools/constants";
import useUser from "services/firebase/user";

const useStyles = createStyles((theme) => ({
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `linear-gradient(30deg, #000D 0%, #0000 60%)`,
    display: "grid",
    placeItems: "end start",
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xl * 1.25,
    color: theme.white,
  },
}));
function Banner({
  events,
}: {
  events: (BirthdayEvent | GameEvent | ScoutEvent)[];
}) {
  const user = useUser();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const { dayjs } = useDayjs();

  const { classes } = useStyles();
  const pastEvents = events
    .filter(
      (event) =>
        dayjs().isAfter(event.start_date) &&
        ["scout", "feature scout", "tour", "song"].includes(event.type)
    )
    .sort((a, b) => dayjs(a.start_date).unix() - dayjs(b.start_date).unix());

  const shownEvents: (GameEvent | ScoutEvent)[] = [];
  shownEvents.push(
    pastEvents
      .filter((event) => ["tour", "song"].includes(event.type))
      .at(-1) as GameEvent
  );
  shownEvents.push(
    pastEvents.filter((event) => event.type === "scout").at(-1) as ScoutEvent
  );
  shownEvents.push(
    pastEvents
      .filter((event) => event.type === "feature scout")
      .at(-1) as ScoutEvent
  );

  return (
    <Carousel
      mx="auto"
      loop
      withIndicators
      height={400}
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      sx={(theme) => ({
        width: "100%",
        borderRadius: theme.radius.sm,
        overflow: "hidden",
        userSelect: "none",
      })}
      slideGap="xs"
    >
      <Carousel.Slide>
        <Picture
          alt={"Makoto gaming"}
          srcB2={`assets/card_still_full1_3117_normal.png`}
          sx={{ width: "100%", height: "100%" }}
          radius="sm"
        />
        <Box className={classes.bannerOverlay}>
          <Stack spacing={4} align="start">
            <Title order={2}>Welcome to MakoTools!</Title>
            <Button
              variant="white"
              color="dark"
              component={NextLink}
              href={user.loggedIn ? CONSTANTS.EXTERNAL_URLS.PATREON : "/login"}
              target="_blank"
            >
              {user.loggedIn ? "Support us on Patreon!" : "Create an account!"}
            </Button>
          </Stack>
        </Box>
      </Carousel.Slide>
      {shownEvents.map((event) => (
        <Carousel.Slide key={event.name}>
          <Picture
            alt={event.name || "caption"}
            srcB2={`assets/card_still_full1_${event.banner_id}_evolution.png`}
            sx={{ width: "100%", height: "100%" }}
            radius="sm"
          />
          <Box className={classes.bannerOverlay}>
            <Stack spacing={0}>
              <Title order={2}>
                {event.type === "song"
                  ? event.name
                  : event.type === "tour"
                  ? event.name
                  : event.type === "scout"
                  ? `SCOUT! ${event.name}`
                  : event.type === "feature scout"
                  ? `Featured Scout: ${event.name}`
                  : event.name}
              </Title>
              <Text weight={500} sx={{ opacity: 0.75 }}>
                {dayjs(event.start_date).format("lll")}
                {" – "}
                {dayjs(event.end_date).format("lll z")}
              </Text>
            </Stack>
          </Box>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}

export default Banner;
