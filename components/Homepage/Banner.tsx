import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";
import { Box, Button, createStyles, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

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
  console.log(events);

  const { classes } = useStyles();
  const pastEvents = events
    .filter(
      (event) =>
        dayjs().isAfter(event.start_date) &&
        ["scout", "feature scout", "tour", "song"].includes(event.type)
    )
    .sort((a, b) => dayjs(a.start_date).unix() - dayjs(b.start_date).unix());

  const shownEvents: (GameEvent | ScoutEvent | BirthdayEvent)[] = [];

  const currentBirthdays = events.filter(
    (event) =>
      dayjs(event.start_date).isToday() && ["birthday"].includes(event.type)
  );

  shownEvents.push(...currentBirthdays);

  console.log("shownEvents post bday", shownEvents);

  const pastGameEvents = pastEvents.filter((event) =>
    ["tour", "song"].includes(event.type)
  );
  shownEvents.push(pastGameEvents[pastGameEvents.length - 1] as GameEvent);

  const pastScouts = pastEvents.filter((event) => event.type === "scout");
  shownEvents.push(pastScouts[pastScouts.length - 1] as ScoutEvent);

  const pastFs = pastEvents.filter((event) => event.type === "feature scout");
  shownEvents.push(pastFs[pastFs.length - 1] as ScoutEvent);

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
              component={Link}
              href={user.loggedIn ? CONSTANTS.EXTERNAL_URLS.PATREON : "/login"}
              target="_blank"
            >
              {user.loggedIn ? "Support us on Patreon!" : "Create an account!"}
            </Button>
          </Stack>
        </Box>
      </Carousel.Slide>
      {shownEvents.map((event) => {
        console.log("event", event);
        return (
          <Carousel.Slide key={event.name[0]}>
            <Picture
              alt={event.name[0] || "caption"}
              srcB2={`assets/card_still_full1_${event.banner_id}_${
                event.type === "birthday" ? "normal" : "evolution"
              }.png`}
              sx={{ width: "100%", height: "100%" }}
              radius="sm"
            />
            <Box className={classes.bannerOverlay}>
              <Stack spacing={0}>
                <Title order={2}>
                  {event.type === "song"
                    ? event.name[0]
                    : event.type === "tour"
                    ? event.name[0]
                    : event.type === "scout"
                    ? `SCOUT! ${event.name[0]}`
                    : event.type === "feature scout"
                    ? event.name[0]
                    : event.type === "birthday"
                    ? `Happy birthday, ${event.name.split(" ")[0]}!`
                    : event.name[0]}
                </Title>
                <Text weight={500} sx={{ opacity: 0.75 }}>
                  {event.type !== "birthday"
                    ? dayjs(event.start_date).format("lll") +
                      " – " +
                      dayjs(event.end_date).format("lll z")
                    : dayjs(event.start_date).format("MMMM D")}
                </Text>
              </Stack>
            </Box>
          </Carousel.Slide>
        );
      })}
    </Carousel>
  );
}

export default Banner;
