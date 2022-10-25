import {
  Text,
  Accordion,
  Anchor,
  Box,
  createStyles,
  Title,
  Group,
} from "@mantine/core";
import {
  IconCalendarTime,
  IconZodiacAquarius,
  IconZodiacAries,
  IconZodiacCancer,
  IconZodiacCapricorn,
  IconZodiacGemini,
  IconZodiacLeo,
  IconZodiacLibra,
  IconZodiacPisces,
  IconZodiacSagittarius,
  IconZodiacScorpio,
  IconZodiacTaurus,
  IconZodiacVirgo,
} from "@tabler/icons";
import Link from "next/link";

import { useDayjs } from "../../services/libraries/dayjs";

import { BirthdayEvent, GameEvent, ScoutEvent } from "types/game";
import { retrieveClosestEvents } from "services/events";
import Picture from "components/core/Picture";

/* END FUNCTION */

// choose horoscope from value
function HoroscopeSymbol({ ...props }) {
  switch (props.horoscope) {
    // ^ stream knockin' fantasy
    case 0:
      return <IconZodiacAries className={props.className} size={48} />;
    case 1:
      return <IconZodiacTaurus className={props.className} size={48} />;
    case 2:
      return <IconZodiacGemini className={props.className} size={48} />;
    case 3:
      return <IconZodiacCancer className={props.className} size={48} />;
    case 4:
      return <IconZodiacLeo className={props.className} size={48} />;
    case 5:
      return <IconZodiacVirgo className={props.className} size={48} />;
    case 6:
      return <IconZodiacLibra className={props.className} size={48} />;
    case 7:
      return <IconZodiacScorpio className={props.className} size={48} />;
    case 8:
      return <IconZodiacSagittarius className={props.className} size={48} />;
    case 9:
      return <IconZodiacCapricorn className={props.className} size={48} />;
    case 10:
      return <IconZodiacAquarius className={props.className} size={48} />;
    case 11:
      return <IconZodiacPisces className={props.className} size={48} />;
    default:
      return null;
  }
}

const useStyles = createStyles((theme, _params) => ({
  panel: {
    margin: "auto",
    transition: "background-color 0.1s",
    marginTop: "0.5vh",

    "&:hover": {
      cursor: "pointer",
      backgroundColor: `${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  },

  eventCard: {
    width: "100%",
  },

  eventInfo: {
    marginTop: "1vh",
  },

  eventType: {
    fontVariant: "small-caps",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },
}));

// create individual event card
function EventCard({
  event,
}: {
  event: BirthdayEvent | GameEvent | ScoutEvent;
}) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();
  const formattedMonth = dayjs(event.start_date).format("MMM");
  const formattedDate = dayjs(event.start_date).format("D");

  let link = (event as BirthdayEvent).character_id
    ? `/characters/${(event as BirthdayEvent).character_id}`
    : (event as GameEvent).event_id
    ? `/events/${(event as GameEvent).event_id}`
    : `/scouts/${(event as ScoutEvent).gacha_id}`;

  if (event.type === "birthday") {
    return (
      <Accordion.Panel className={classes.panel}>
        <Link href={link} passHref>
          <Group
            className={classes.eventCard}
            align="flex-start"
            position="apart"
            spacing="xl"
          >
            <Box>
              <Title order={2}>{formattedDate}</Title>
              <Title order={5}>{formattedMonth}</Title>
            </Box>
            <Box className={classes.eventInfo}>
              <Text weight={550} size="md">
                {event.name}
              </Text>
              <Title order={6} className={classes.eventType}>
                {event.type}
              </Title>
            </Box>
            <Picture
              alt={event.name}
              srcB2={`assets/card_still_full1_${event.banner_id}_normal.webp`}
              sx={(theme) => ({
                width: 70,
                height: 70,
                overflow: "hidden",
                borderRadius: "35px",
                border: `1px solid ${
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[2]
                    : theme.colors.gray[4]
                }`,
              })}
            />
          </Group>
        </Link>
      </Accordion.Panel>
    );
  } else {
    return (
      <Accordion.Panel className={classes.panel}>
        <Link href={link} passHref>
          <Group
            className={classes.eventCard}
            align="flex-start"
            position="center"
            spacing="xl"
          >
            <Box>
              <Title order={2}>{formattedDate}</Title>
              <Title order={6}>{formattedMonth}</Title>
            </Box>
            <Box sx={{ maxWidth: "200px" }}>
              <Picture
                alt={event.name}
                srcB2={`assets/card_still_full1_${event.banner_id}_evolution.webp`}
                sx={(theme) => ({
                  height: 80,
                  width: 195,
                  overflow: "hidden",
                  borderRadius: theme.radius.lg,
                  border: `1px solid ${
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[4]
                      : theme.colors.gray[4]
                  }`,
                })}
              />
              <Text weight={550} size="md" sx={{ maxWidth: "180px" }}>
                {event.name}
              </Text>
              <Title order={6} className={classes.eventType}>
                {event.type}
              </Title>
            </Box>
          </Group>
        </Link>
      </Accordion.Panel>
    );
  }
}

function UpcomingCampaigns({
  events,
}: {
  events: (BirthdayEvent | GameEvent | ScoutEvent)[];
}) {
  const { dayjs } = useDayjs();

  return (
    <Accordion.Item value="birthday">
      <Accordion.Control icon={<IconCalendarTime size={18} />}>
        <Text inline weight={500}>
          Upcoming Campaigns
        </Text>
      </Accordion.Control>
      {retrieveClosestEvents(events, 4).map(
        (e: BirthdayEvent | GameEvent | ScoutEvent, index) => {
          return <EventCard key={index} event={e} />;
        }
      )}
      <Accordion.Panel>
        <Box mt="xs">
          <Link href="/calendar" passHref>
            <Anchor component="a" size="xs">
              Open calendar
            </Anchor>
          </Link>
        </Box>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default UpcomingCampaigns;
