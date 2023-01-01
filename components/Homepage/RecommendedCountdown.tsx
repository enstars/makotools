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
import { IconCalendarDue, IconHeart, IconStar } from "@tabler/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";

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
import ToyaDed from "assets/ToyaDed.png";

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
      return getNameOrder(nameObj, user.db?.setting__name_order);
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
    <Paper p={5} withBorder shadow="xs" component={Link} href={link}>
      <Stack>
        <Image
          alt={event.name[0]}
          src={getAssetURL(
            `assets/card_still_full1_${event.banner_id}_${
              event.type === "birthday" ? "normal" : "evolution"
            }.webp`
          )}
          radius="sm"
        />
        <Group spacing="xs" align="center" position="left">
          <IconStar size={14} />
          <Text size="xs" color="dimmed">
            Because you like{" "}
            <Text weight={700} component="span">
              {returnCharOrUnitName()}
            </Text>
          </Text>
        </Group>
        <Title order={4}>
          {event.type === "birthday"
            ? `${event.name[0]}'s Birthday`
            : event.name[0]}
        </Title>
        <Group>
          <Badge leftSection={<IconCalendarDue size={19} />}>
            {countdownAmt}
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
          <Text weight={600}>Starts on</Text>
          <Text
            weight={600}
            py={1}
            px={15}
            sx={{
              background: `${theme.colors.yellow[6]}33`,
              borderRadius: theme.radius.lg,
            }}
          >
            {dayjs(event.start.en).format("MM-DD-YYYY")}
          </Text>
        </Group>
      </Stack>
    </Paper>
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
  const { dayjs } = useDayjs();
  const user = useUser();
  const theme = useMantineTheme();

  const getOnlyEvents = (events: any[]): (Event | Scout | Birthday)[] => {
    let entries = Object.entries(events);
    let returnArray: (Event | Scout | Birthday)[] = [];

    entries.forEach((entry) => returnArray.push(entry[1].event));
    return returnArray;
  };

  return (
    <Container my="3vh">
      <Title order={2}>Recommended Campaigns</Title>
      <Alert my={3} icon={<IconHeart />}>
        Recommendations are based on the favorite characters and units listed in
        your profile.
      </Alert>
      {user.loggedIn &&
      user.db &&
      (!user.db.profile__fave_charas ||
        user.db.profile__fave_charas.length === 0) ? (
        <Paper p={20} my={10}>
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
      ) : user.db.profile__fave_charas &&
        user.db.profile__fave_charas[0] === -1 ? (
        <Paper p={20} my={10}>
          <Text>
            Well, since you hate Ensemble Stars so much, we won&apos;t show you
            any recommendations. How does that sound?
          </Text>
          <Image
            src={ToyaDed.src}
            alt="He doesn't know what to do."
            width={100}
            sx={{ pointerEvents: "none" }}
            mt={5}
          />
        </Paper>
      ) : events.length === 0 ? (
        <Paper p={20} my={10}>
          <Text>There are no upcoming recommended campaigns available.</Text>
        </Paper>
      ) : (
        <ResponsiveGrid width={230} my={5}>
          {retrieveNextCampaigns(
            getOnlyEvents(events),
            events.length >= 6 ? 6 : events.length
          )
            .filter((e) => dayjs(e.start.en).isAfter(dayjs()))
            .map((e: Event | Scout | Birthday, i) => (
              <RecommendedCard
                key={i}
                event={
                  events[events.findIndex((ev: any) => ev.event === e)].event
                }
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
      )}
    </Container>
  );
}

export default RecommendedCountdown;
