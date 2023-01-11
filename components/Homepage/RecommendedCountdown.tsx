import {
  Alert,
  Container,
  Paper,
  Image,
  Text,
  Title,
  useMantineTheme,
  Group,
  Stack,
  Button,
  Tooltip,
  Box,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCalendarDue,
  IconHeart,
  IconStar,
} from "@tabler/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";

import { countdown, retrieveNextCampaigns } from "services/campaigns";
import useUser from "services/firebase/user";
import {
  Birthday,
  GameCharacter,
  Event,
  Scout,
  GameUnit,
  Campaign,
} from "types/game";
import { getAssetURL } from "services/data";
import { useDayjs } from "services/libraries/dayjs";
import { getNameOrder } from "services/game";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import HokkeConcern from "assets/HokkeConcern.png";
import { UserLoggedIn } from "types/makotools";

function RecommendedCard({
  event,
  faveChar,
  faveUnit,
  characters,
  units,
}: {
  event: Event | Scout | Birthday;
  faveChar?: number;
  faveUnit?: number;
  characters: GameCharacter[];
  units: GameUnit[];
}) {
  const { dayjs } = useDayjs();
  const user = useUser();
  const { t } = useTranslation("home");
  const theme = useMantineTheme();
  const [countdownAmt, setCountdownAmt] = useState<string>();
  useEffect(() => {
    const interval = setInterval(() => {
      let ctdwn = countdown(new Date(event.start.en), new Date());
      const d = Math.floor(ctdwn / 86400000);
      const h = Math.floor((ctdwn % 86400000) / 3600000);
      const m = Math.floor(((ctdwn % 86400000) % 3600000) / 60000);
      const s = Math.floor((((ctdwn % 86400000) % 3600000) % 60000) / 1000);
      setCountdownAmt(
        d === 0 && h === 0 && m === 0
          ? `${s} secs`
          : d === 0 && h === 0
          ? `${m} mins`
          : d === 0
          ? `${h} hrs`
          : `${d} days`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [event.start.en]);

  function returnCharOrUnitName(): string {
    if (faveChar) {
      let char = characters.filter((c) => c.character_id === faveChar)[0];
      let nameObj = {
        first_name: char.first_name[0],
        last_name: char.last_name[0],
      };
      return getNameOrder(
        nameObj,
        (user as UserLoggedIn).db?.setting__name_order
      );
    } else {
      return units.filter((u) => u.id === faveUnit)[0].name[0];
    }
  }

  let link = (event as Birthday).character_id
    ? `/characters/${(event as Birthday).character_id}`
    : ((event as Event).event_id && event.type === "song") ||
      event.type === "shuffle" ||
      event.type == "tour"
    ? `/events/${(event as Event).event_id}`
    : `/scouts/${(event as Scout).gacha_id}`;
  return (
    <Paper
      withBorder
      shadow="xs"
      p={5}
      component={Link}
      href={
        event.type === "birthday"
          ? `/characters/${event.character_id}`
          : event.type === "feature scout" || event.type === "scout"
          ? `/scouts/${event.gacha_id}`
          : `/events/${event.event_id}`
      }
    >
      <Group noWrap align="flex-start" spacing="xs">
        <Image
          alt={event.name[0]}
          src={getAssetURL(
            `assets/card_still_full1_${event.banner_id}_${
              event.type === "birthday" ? "normal" : "evolution"
            }.webp`
          )}
          width={80}
          height={80}
          radius="md"
        />
        <Stack spacing="xs">
          <Group noWrap spacing={3} align="center" position="left">
            <IconStar size={14} />
            <Text size="xs" color="dimmed" lineClamp={1}>
              Because you like{" "}
              <Text weight={700} component="span">
                {returnCharOrUnitName()}
              </Text>
            </Text>
          </Group>
          <Text weight={700} lineClamp={1}>
            {event.type === "birthday"
              ? `${event.name[0].split(" ")[1]}'s Birthday`
              : event.name[0]}
          </Text>
          <Group spacing={3} align="center">
            <IconCalendarDue size={16} />
            <Tooltip
              label={dayjs(event.start.en).format("MMMM DD YYYY")}
              position="bottom"
            >
              <Text size="sm" weight={500}>
                Starts in {countdownAmt}
              </Text>
            </Tooltip>
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
}

function RecommendedSlide({
  events,
  eventsSlide,
  characters,
  units,
}: {
  events: any[];
  eventsSlide: Event[];
  characters: GameCharacter[];
  units: GameUnit[];
}) {
  const { dayjs } = useDayjs();
  return (
    <ResponsiveGrid width={230} my={5}>
      {eventsSlide
        .filter((e) => dayjs(e.start.en).isAfter(dayjs()))
        .map((e: Event | Scout | Birthday, i) => (
          <RecommendedCard
            key={i}
            event={events[events.findIndex((ev: any) => ev.event === e)].event}
            faveChar={
              events[events.findIndex((ev: any) => ev.event === e)].charId
            }
            faveUnit={
              events[events.findIndex((ev: any) => ev.event === e)].unitId
            }
            characters={characters}
            units={units}
          />
        ))}
    </ResponsiveGrid>
  );
}

function RecommendedCountdown({
  events,
  characters,
  units,
}: {
  events: {
    event: Campaign;
    charId?: number;
    unitId?: number;
  }[];
  characters: GameCharacter[];
  units: GameUnit[];
}) {
  const user = useUser();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);

  const GRID_TOTAL = 3;
  const getOnlyEvents = (events: any[]): (Event | Scout | Birthday)[] => {
    let entries = Object.entries(events);
    let returnArray: (Event | Scout | Birthday)[] = [];

    entries.forEach((entry) => returnArray.push(entry[1].event));
    return returnArray;
  };

  let slidesArr: any[] = [];

  const sortedEvents = retrieveNextCampaigns(
    getOnlyEvents(events),
    events.length
  );

  for (let i = 0; i < sortedEvents.length; i += GRID_TOTAL) {
    let slide = sortedEvents.slice(i, i + GRID_TOTAL);
    slidesArr.push(slide);
  }

  return (
    <Container my="7vh">
      <Title order={2}>Recommended Campaigns</Title>
      <Alert my={3} icon={<IconHeart />}>
        Recommendations are based on the favorite characters and units listed in
        your profile.
      </Alert>
      {user.loggedIn &&
      user.db &&
      (!user.db.profile__fave_charas ||
        user.db.profile__fave_charas.length === 0) ? (
        <Paper p={15} my={10}>
          <Text>
            There are no recommended campaigns available. Perhaps you should add
            your favorite characters or units to{" "}
            <Text
              color={theme.colors[theme.primaryColor][4]}
              component={Link}
              href={`/@${user.db.username}`}
            >
              your profile
            </Text>
            !
          </Text>
        </Paper>
      ) : (user as UserLoggedIn).db.profile__fave_charas &&
        (user as UserLoggedIn).db.profile__fave_charas[0] === -1 ? (
        <Box mt={10}>
          <Group noWrap mb={10}>
            <Image
              src={HokkeConcern.src}
              alt="Hokke is concerned."
              width={80}
              sx={{ pointerEvents: "none" }}
              mt={5}
            />
            <Stack>
              <Paper withBorder py={20} pl={15} pr={40}>
                <Text component="span">
                  You seem to not like anyone... Not even{" "}
                  {Math.floor(Math.random() * 2) === 0 ? "Akehoshi" : "Yuuki"}?
                </Text>
              </Paper>
              <Text size="xs" color="dimmed">
                (You indicated that you hate Ensemble Stars on your profile)
              </Text>
            </Stack>
          </Group>
        </Box>
      ) : events.length === 0 ? (
        <Paper p={20} my={10}>
          <Text>There are no upcoming recommended campaigns available.</Text>
        </Paper>
      ) : (
        <Carousel
          loop
          my="1vh"
          orientation={isMobile ? "vertical" : "horizontal"}
          height={isMobile ? 400 : 120}
          withControls={!isMobile}
          controlSize={40}
          controlsOffset="xs"
          nextControlIcon={
            <Button
              variant="default"
              rightIcon={<IconArrowRight />}
              styles={(theme) => ({
                icon: {
                  color: theme.colors[theme.primaryColor][4],
                },
                label: {
                  color: theme.colors[theme.primaryColor][4],
                },
              })}
            >
              Next
            </Button>
          }
          previousControlIcon={
            <Button
              variant="default"
              leftIcon={<IconArrowLeft />}
              styles={(theme) => ({
                icon: {
                  color: theme.colors[theme.primaryColor][4],
                },
                label: {
                  color: theme.colors[theme.primaryColor][4],
                },
              })}
            >
              Previous
            </Button>
          }
          align={isMobile ? "start" : "center"}
          styles={(theme) => ({
            controls: {
              top: "100%",
            },
            control: {
              border: "none",
              background: "none",
            },
          })}
        >
          {slidesArr.map((slide, i) => {
            return (
              <Carousel.Slide key={i}>
                <RecommendedSlide
                  events={events}
                  eventsSlide={slide}
                  characters={characters}
                  units={units}
                />
              </Carousel.Slide>
            );
          })}
        </Carousel>
      )}
    </Container>
  );
}

export default RecommendedCountdown;
