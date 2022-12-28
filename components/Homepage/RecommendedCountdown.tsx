import { Carousel } from "@mantine/carousel";
import {
  Alert,
  Container,
  Paper,
  Image,
  Text,
  Title,
  useMantineTheme,
  Badge,
  Group,
  Stack,
} from "@mantine/core";
import { IconCalendarDue, IconExclamationMark, IconStar } from "@tabler/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";

import {
  countdown,
  retrieveClosestEvents,
  toCountdownReadable,
} from "services/events";
import useUser from "services/firebase/user";
import {
  BirthdayEvent,
  GameCharacter,
  GameEvent,
  ScoutEvent,
} from "types/game";
import { getAssetURL } from "services/data";
import { useDayjs } from "services/libraries/dayjs";
import { getNameOrder } from "services/game";
import { UserLoggedIn } from "types/makotools";

function RecommendedCard({
  event,
  fave,
  characters,
}: {
  event: GameEvent | ScoutEvent | BirthdayEvent;
  fave: number;
  characters: GameCharacter[];
}) {
  console.log(event);
  const { dayjs } = useDayjs();
  const user = useUser();
  const { t } = useTranslation("home");
  const [countdownAmt, setCountdownAmt] = useState<string>();
  useEffect(() => {
    const interval = setInterval(() => {
      let ctdwn = countdown(new Date(event.start_date), new Date());
      setCountdownAmt(toCountdownReadable(ctdwn));
    }, 1000);
    return () => clearInterval(interval);
  }, [event.start_date]);

  const getCharaObj = characters.filter((c) => c.character_id === fave)[0];

  const nameObj = {
    first_name: getCharaObj.first_name[0],
    last_name: getCharaObj.last_name[0],
  };

  let link = (event as BirthdayEvent).character_id
    ? `/characters/${(event as BirthdayEvent).character_id}`
    : ((event as GameEvent).event_id && event.type === "song") ||
      event.type === "shuffle" ||
      event.type == "tour" ||
      event.type === "anniversary"
    ? `/events/${(event as GameEvent).event_id}`
    : `/scouts/${(event as ScoutEvent).gacha_id}`;
  return (
    <Paper p={5} withBorder shadow="xs" component={Link} href={link}>
      <Stack>
        <Image
          alt={event.type === "birthday" ? event.name : event.name[0]}
          src={getAssetURL(
            `assets/card_still_full1_${event.banner_id}_${
              event.type === "birthday" ? "normal" : "evolution"
            }.webp`
          )}
          radius="sm"
        />
        <Text weight={700} my={3}>
          {typeof event.name === "string"
            ? `${event.name}'s Birthday`
            : event.name[0]}
        </Text>
        <Group>
          <Badge leftSection={<IconCalendarDue size={14} />}>
            {dayjs(event.start_date).format("MM-DD-YYYY")}
          </Badge>
          <Badge
            variant="filled"
            color={
              event.type === "birthday"
                ? "cyan"
                : event.type === "feature scout"
                ? "blue"
                : event.type === "scout"
                ? "indigo"
                : event.type === "song"
                ? "yellow"
                : "green"
            }
          >
            {event.type}
          </Badge>
        </Group>
        <Group spacing="xs">
          <Text weight={600}>{t("event.start")}</Text>
          <Text weight={600}>{countdownAmt}</Text>
        </Group>
        <Alert icon={<IconExclamationMark />} p={5}>
          <Text size="sm">
            Because you like{" "}
            {getNameOrder(
              nameObj,
              (user as UserLoggedIn).db.setting__name_order
            )}
          </Text>
        </Alert>
      </Stack>
    </Paper>
  );
}

function RecommendedCountdown({
  events,
  characters,
}: {
  events: {
    events: { event: GameEvent | ScoutEvent | BirthdayEvent };
    charId: number;
  }[];
  characters: GameCharacter[];
}[]) {
  const { dayjs } = useDayjs();
  const user = useUser();
  const theme = useMantineTheme();

  const getOnlyEvents = (
    events: any[]
  ): (GameEvent | ScoutEvent | BirthdayEvent)[] => {
    let entries = Object.entries(events);
    let returnArray: (GameEvent | ScoutEvent | BirthdayEvent)[] = [];

    entries.forEach((entry) => returnArray.push(entry[1].event));
    return returnArray;
  };

  console.log(getOnlyEvents(events));

  return (
    <Container my="3vh">
      <Title order={2}>Recommended Campaigns</Title>
      <Alert my={3} icon={<IconStar />}>
        Recommendations are based on the favorite characters listed in your
        profile.
      </Alert>
      {user.loggedIn &&
      user.db &&
      (!user.db.profile__fave_charas ||
        user.db.profile__fave_charas.length === 0) ? (
        <Paper p={5} my={10}>
          <Text>
            There are no recommended campaigns available. Perhaps you should add
            your favorite characters to{" "}
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
      ) : events.length === 0 ? (
        <Paper p={5} my={10}>
          <Text>There are no upcoming recommended campaigns available.</Text>
        </Paper>
      ) : (
        <Carousel
          align="start"
          loop
          draggable={false}
          slideSize="33.333333%"
          slideGap="md"
          breakpoints={[
            { maxWidth: "md", slideSize: "50%" },
            { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
          ]}
          my={15}
        >
          {retrieveClosestEvents(getOnlyEvents(events), 15)
            .filter((e) => dayjs(e.start_date).isAfter(dayjs()))
            .map((e: GameEvent | ScoutEvent | BirthdayEvent, i) => (
              <Carousel.Slide key={i}>
                <RecommendedCard
                  event={
                    events[events.findIndex((ev: any) => ev.event === e)].event
                  }
                  fave={
                    events[events.findIndex((ev: any) => ev.event === e)].charId
                  }
                  characters={characters}
                />
              </Carousel.Slide>
            ))}
        </Carousel>
      )}
    </Container>
  );
}

export default RecommendedCountdown;
