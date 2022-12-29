import { useMemo, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";
import { Box, Button, createStyles, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

import { Birthday, Event, Scout } from "types/game";
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
function Banner({ events }: { events: (Birthday | Event | Scout)[] }) {
  const { t } = useTranslation("home");
  const user = useUser();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const { dayjs } = useDayjs();
  const { classes } = useStyles();
  const pastEvents = events
    .filter(
      (event) =>
        dayjs().isAfter(event.start.jp) &&
        ["scout", "feature scout", "tour", "song"].includes(event.type)
    )
    .sort((a, b) => dayjs(a.start.jp).unix() - dayjs(b.start.jp).unix());

  const banners = useMemo(() => {
    const shownEvents: (Event | Scout | Birthday)[] = [];

    const currentBirthdays = events.filter(
      (event) =>
        event.type === "birthday" &&
        dayjs(event.start.jp).format("MMDD") === dayjs().format("MMDD")
    );

    shownEvents.push(...currentBirthdays);

    const pastGameEvents = pastEvents.filter((event) =>
      ["tour", "song"].includes(event.type)
    );
    shownEvents.push(pastGameEvents[pastGameEvents.length - 1] as Event);

    const pastScouts = pastEvents.filter((event) => event.type === "scout");
    shownEvents.push(pastScouts[pastScouts.length - 1] as Scout);

    const pastFs = pastEvents.filter((event) => event.type === "feature scout");
    shownEvents.push(pastFs[pastFs.length - 1] as Scout);

    return shownEvents;
  }, [dayjs, events, pastEvents]);

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
            <Title order={2}>{t("welcome")}</Title>
            <Button
              variant="white"
              color="dark"
              component={Link}
              href={user.loggedIn ? CONSTANTS.EXTERNAL_URLS.PATREON : "/login"}
              target="_blank"
            >
              {user.loggedIn ? t("supportOnPatreon") : t("createAccount")}
            </Button>
          </Stack>
        </Box>
      </Carousel.Slide>
      {banners.map((event) => (
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
                  ? t("banner.scout", { name: event.name[0] })
                  : event.type === "feature scout"
                  ? t("banner.fs", { name: event.name[0] })
                  : event.type === "birthday"
                  ? t("banner.birthday", {
                      name: event.name,
                    })
                  : event.name[0]}
              </Title>
              <Text weight={500} sx={{ opacity: 0.75 }}>
                {event.type !== "birthday"
                  ? dayjs(event.start.jp).format("lll") +
                    " – " +
                    dayjs(event.end.jp).format("lll z")
                  : dayjs(event.start.jp).format("MMMM D")}
              </Text>
            </Stack>
          </Box>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}

export default Banner;
