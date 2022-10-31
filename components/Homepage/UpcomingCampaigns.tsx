import {
  Text,
  Accordion,
  Anchor,
  Box,
  createStyles,
  Title,
  Group,
  Badge,
} from "@mantine/core";
import {
  IconAward,
  IconBus,
  IconCake,
  IconCalendarTime,
  IconDiamond,
  IconShirt,
  IconStar,
} from "@tabler/icons";
import Link from "next/link";

import { useDayjs } from "../../services/libraries/dayjs";

import { BirthdayEvent, GameEvent, ScoutEvent } from "types/game";
import { retrieveClosestEvents } from "services/events";
import Picture from "components/core/Picture";

/* END FUNCTION */

const useStyles = createStyles((theme, _params) => ({
  panel: {
    margin: "auto",
    transition: "background-color 0.1s",
    marginTop: "0.5vh",
  },

  eventCard: {
    width: "100%",
    minWidth: "100%",

    "&:hover": {
      cursor: "pointer",
      backgroundColor: `${
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[2]
      }`,
    },
  },

  eventInfo: {
    // marginTop: "1vh",
  },

  eventType: {
    // fontVariant: "small-caps",
    // color:
    //   theme.colorScheme === "dark"
    //     ? theme.colors.dark[2]
    //     : theme.colors.gray[6],
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

  return (
    <Box
      component={Link}
      href={link}
      className={classes.eventCard}
      sx={(theme) => ({
        display: "flex",
        flexAlign: "flex-start",
        justifyContent: "left",
        gap: theme.spacing.sm,
        flexWrap: "nowrap",
        minWidth: 0,
        marginLeft: -16,
        marginRight: -16,
        width: "calc(100% + 32px)",
      })}
      py="xs"
      px="md"
    >
      <Box sx={{ width: 38, flexShrink: 0 }}>
        <Title
          order={2}
          sx={(theme) => ({
            fontSize: theme.fontSizes.xl * 1.25,
          })}
          weight={900}
          inline
        >
          {formattedDate}
        </Title>
        <Text size="md" weight={700} color="dimmed">
          {formattedMonth}
        </Text>
      </Box>
      <Group
        align="start"
        sx={(theme) => ({
          "&&&": { flexGrow: 3 },
          rowGap: theme.spacing.xs / 2,
          columnGap: theme.spacing.xs,
          flexWrap: "wrap-reverse",
          minWidth: 0,
        })}
      >
        <Box
          className={classes.eventInfo}
          sx={{
            "&&&": { flexGrow: 2, minWidth: 120, flexBasis: 60 },
          }}
        >
          <Title order={3} weight={700} size="md" sx={{ lineHeight: 1.2 }}>
            {event.name}
          </Title>

          <Badge
            size="sm"
            className={classes.eventType}
            variant="filled"
            color={
              event.type === "anniversary"
                ? "yellow"
                : event.type === "birthday"
                ? "cyan"
                : event.type === "feature scout"
                ? "lightblue"
                : event.type === "scout"
                ? "violet"
                : "yellow"
            }
            px={6}
            leftSection={
              <Text inline mt={0}>
                {event.type === "birthday" ? (
                  <IconCake size={12} strokeWidth={3} />
                ) : event.type === "anniversary" ? (
                  <IconStar size={12} strokeWidth={3} />
                ) : event.type === "feature scout" ? (
                  <IconShirt size={12} strokeWidth={3} />
                ) : event.type === "scout" ? (
                  <IconDiamond size={12} strokeWidth={3} />
                ) : event.type === "song" ? (
                  <IconAward size={12} strokeWidth={3} />
                ) : (
                  <IconBus size={12} strokeWidth={3} />
                )}
              </Text>
            }
          >
            {event.type}
          </Badge>
        </Box>
        <Picture
          alt={event.name}
          srcB2={`assets/card_still_full1_${event.banner_id}_normal.webp`}
          radius="sm"
          sx={(theme) => ({
            "&&&": {
              flexGrow: 1,
              flexShrink: 0,
              width: 70,
              height: 70,
              overflow: "hidden",
              borderRadius: theme.radius.sm,
              border: `1px solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[4]
              }`,
              // maxWidth: 120,
            },
          })}
        />
      </Group>
    </Box>
  );
}

function UpcomingCampaigns({
  events,
}: {
  events: (BirthdayEvent | GameEvent | ScoutEvent)[];
}) {
  const { dayjs } = useDayjs();
  const { classes } = useStyles();

  return (
    <Accordion.Item value="birthday">
      <Accordion.Control icon={<IconCalendarTime size={18} />}>
        <Text inline weight={500}>
          Upcoming Campaigns
        </Text>
      </Accordion.Control>

      <Accordion.Panel className={classes.panel} px={0}>
        {retrieveClosestEvents(events, 8).map(
          (e: BirthdayEvent | GameEvent | ScoutEvent, index) => {
            return <EventCard key={index} event={e} />;
          }
        )}
        <Box mt="xs">
          <Anchor component={Link} href="/calendar" size="sm">
            See full calendar
          </Anchor>
        </Box>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default UpcomingCampaigns;
