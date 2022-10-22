import {
  Text,
  Accordion,
  Anchor,
  Box,
  Image,
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

import { Event, BirthdayEvent, GameEvent, ScoutEvent } from "types/game";
import { getAssetURL } from "services/data";

function retrieveClosestEvents(
  events: (BirthdayEvent | GameEvent | ScoutEvent)[],
  dayjs: any
): (Event | BirthdayEvent | GameEvent | ScoutEvent)[] {
  let thisYear = new Date().getFullYear();
  const todaysDate: Event = {
    name: "",
    start_date: dayjs(new Date()).format("YYYY-MM-DD"),
    type: "other",
  };

  // add proper years to the bdays
  events.forEach((event) => {
    if (new Date(event.start_date).getFullYear() === 2000) {
      let splitDate = event.start_date.split("-");
      let year =
        parseInt(splitDate[1]) <= new Date().getMonth()
          ? new Date().getFullYear() + 1
          : new Date().getFullYear();
      event.start_date = `${year}-${splitDate[1]}-${splitDate[2]}`;
    }
  });

  let sortedEvents = [...events, todaysDate];

  // sort array by date
  sortedEvents.sort(
    (
      a: BirthdayEvent | GameEvent | ScoutEvent | Event,
      b: BirthdayEvent | GameEvent | ScoutEvent | Event
    ) => {
      return a.start_date < b.start_date
        ? -1
        : a.start_date > b.start_date
        ? 1
        : 0;
    }
  );

  // find today's date in array and retrieve the next 5 dates
  let todayIndex = sortedEvents.indexOf(todaysDate) + 1;

  let newArray: (BirthdayEvent | GameEvent | ScoutEvent | Event)[] = [];

  while (newArray.length < 4) {
    newArray.push(sortedEvents[todayIndex]);
    if (todayIndex === sortedEvents.length - 1) {
      todayIndex = -1;
    }
    todayIndex++;
  }
  console.log(newArray);

  return newArray;
}
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
  eventCard: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  eventImg: {
    maxWidth: "180px",
    maxHeight: "90px",
    overflow: "hidden",
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.colors.blue[3]}`,

    img: {
      marginLeft: "-140px",
      marginTop: "-20px",
    },

    "&:hover": {
      cursor: "pointer",
    },
  },

  birthdayImg: {
    maxWidth: "80px",
    maxHeight: "80px",
    overflow: "hidden",
    borderRadius: theme.radius.xl,
    border: `1px solid ${theme.colors.blue[3]}`,

    img: {
      marginLeft: "-175px",
    },
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
function EventCard({ ...props }) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();
  const formattedMonth = dayjs(props.event.start_date).format("MMM");
  const formattedDate = dayjs(props.event.start_date).format("D");

  let link = props.event.character_id
    ? `/characters/${props.event.character_id}`
    : props.event.event_id
    ? `/events/${props.event.event_id}`
    : `/scouts/${props.event.gacha_id}`;

  if (props.event.type === "birthday") {
    return (
      <Accordion.Panel>
        <Link href={link} passHref>
          <Group className={classes.eventCard}>
            <Box>
              <Title order={2}>{formattedDate}</Title>
              <Title order={5}>{formattedMonth}</Title>
            </Box>
            <Box className={classes.eventInfo}>
              <Text weight={550} size="md">
                {props.event.name}
              </Text>
              <Title order={6} className={classes.eventType}>
                {props.event.type}
              </Title>
            </Box>
            <Image
              alt={props.event.name}
              src={getAssetURL(
                `assets/card_still_full1_${props.event.banner_id}_normal.webp`
              )}
              width={400}
              className={classes.birthdayImg}
            />
          </Group>
        </Link>
      </Accordion.Panel>
    );
  } else {
    return (
      <Accordion.Panel>
        <Link href={link} passHref>
          <Group align="flex-start">
            <Box>
              <Title order={2}>{formattedDate}</Title>
              <Title order={6}>{formattedMonth}</Title>
            </Box>
            <Box sx={{ maxWidth: "180px" }}>
              <Image
                alt={props.event.name}
                src={getAssetURL(
                  `assets/card_still_full1_${props.event.banner_id}_evolution.webp`
                )}
                width={500}
                className={classes.eventImg}
              />
              <Text weight={550} size="md">
                {props.event.name}
              </Text>
              <Title order={6} className={classes.eventType}>
                {props.event.type}
              </Title>
            </Box>
          </Group>
        </Link>
      </Accordion.Panel>
    );
  }
}

function UpcomingCampaigns({ ...props }) {
  const { dayjs } = useDayjs();

  return (
    <Accordion variant="contained" defaultValue="birthday">
      <Accordion.Item value="birthday">
        <Accordion.Control icon={<IconCalendarTime size={18} />}>
          <Text inline weight={500}>
            Upcoming Campaigns
          </Text>
        </Accordion.Control>
        {retrieveClosestEvents(props.events, dayjs).map(
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
    </Accordion>
  );
}

export default UpcomingCampaigns;
