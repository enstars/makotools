import { useMemo, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";
import {
  Box,
  Button,
  createStyles,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
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
    // borderRadius: theme.radius.md,
  },
  bannerSlide: {
    clipPath: "border-box",
    position: "relative",
    overflow: "hidden",
    borderRadius: theme.radius.md,
    height: "100%",
  },
}));
function Banner({ events }: { events: (Birthday | Event | Scout)[] }) {
  const theme = useMantineTheme();
  const { t } = useTranslation("home");
  const { user, userDB } = useUser();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const { dayjs } = useDayjs();
  const { classes } = useStyles();
  const pastEvents = events
    .filter(
      (event) =>
        dayjs().isAfter(event.start.en) &&
        ["scout", "feature scout", "special", "tour", "song"].includes(
          event.type
        )
    )
    .sort((a, b) => dayjs(a.start.en).unix() - dayjs(b.start.en).unix());

  const banners = useMemo(() => {
    const shownEvents: (Event | Scout | Birthday)[] = [];

    const currentBirthdays = events.filter(
      (event) =>
        event.type === "birthday" &&
        dayjs(event.start.en).format("MMDD") === dayjs().format("MMDD")
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
        borderRadius: theme.radius.md,
        // overflow: "hidden",
        userSelect: "none",
        "&, *": {
          backfaceVisibility: "hidden",
        },
      })}
      slideGap="xs"
      styles={{
        viewport: {
          overflow: "hidden",
          borderRadius: theme.radius.md,
          clipPath: "border-box",
        },
      }}
    >
      <Carousel.Slide>
        <Box className={classes.bannerSlide}>
          <Picture
            alt={"Makoto gaming"}
            srcB2={`assets/card_still_full1_3117_normal.png`}
            sx={{ width: "100%", height: "100%" }}
            radius="md"
          />
          <Box className={classes.bannerOverlay}>
            <Stack spacing={4} align="start">
              <Title order={2}>{t("welcome")}</Title>
              <Button
                variant="white"
                color="dark"
                component={Link}
                href={userDB ? CONSTANTS.EXTERNAL_URLS.PATREON : "/login"}
                target="_blank"
              >
                {userDB ? t("supportOnPatreon") : t("createAccount")}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Carousel.Slide>
      {banners.map((event) => {
        if (!event) return <></>;
        return (
          <Carousel.Slide key={event.name[0]}>
            <Box className={classes.bannerSlide}>
              <Picture
                alt={event?.name[0] || "caption"}
                srcB2={`assets/card_still_full1_${event.banner_id}_${
                  event.type === "birthday" ? "normal" : "evolution"
                }.png`}
                sx={{ width: "100%", height: "100%" }}
                radius="md"
              />
              <Box className={classes.bannerOverlay}>
                <Stack spacing={0} align="start">
                  <Title order={2}>
                    {event.type === "song"
                      ? event.name[0]
                      : event.type === "tour"
                      ? event.name[0]
                      : event.type === "special"
                      ? event.name[0]
                      : event.type === "scout"
                      ? t("banner.scout", { name: event.name[0] })
                      : event.type === "feature scout"
                      ? t("banner.fs", { name: event.name[0] })
                      : event.type === "birthday"
                      ? t("banner.birthday", {
                          name: event.name[0],
                        })
                      : event.name[0]}
                  </Title>
                  <Text weight={500} sx={{ opacity: 0.75 }}>
                    {event.type !== "birthday"
                      ? dayjs(event.start.en).format("lll") +
                        " – " +
                        dayjs(event.end.en).format("lll z")
                      : dayjs(event.start.en).year(dayjs().year()).format("ll")}
                  </Text>
                  <Button
                    mt={6}
                    variant="white"
                    color="dark"
                    component={Link}
                    href={`/${
                      event.type === "song" ||
                      event.type === "tour" ||
                      event.type === "special" ||
                      event.type === "shuffle"
                        ? "events"
                        : event.type === "scout" ||
                          event.type === "feature scout"
                        ? "scouts"
                        : "characters"
                    }/${
                      event.type === "song" ||
                      event.type === "tour" ||
                      event.type === "special" ||
                      event.type === "shuffle"
                        ? event.event_id
                        : event.type === "scout" ||
                          event.type === "feature scout"
                        ? event.gacha_id
                        : (event as Birthday).character_id
                    }`}
                    target="_blank"
                  >
                    {t("banner.link")}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Carousel.Slide>
        );
      })}
    </Carousel>
  );
}

export default Banner;
