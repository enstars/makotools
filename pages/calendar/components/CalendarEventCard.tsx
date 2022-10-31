import { Badge, Box, createStyles, HoverCard, Text } from "@mantine/core";
import {
  IconAward,
  IconBus,
  IconCake,
  IconDiamond,
  IconShirt,
  IconStar,
} from "@tabler/icons";
import Link from "next/link";

import Picture from "components/core/Picture";
import { useDayjs } from "services/libraries/dayjs";
import {
  BirthdayEvent,
  GameEvent,
  GameEventStatus,
  ScoutEvent,
} from "types/game";

const useStyles = createStyles((theme, _params, getRef) => ({
  eventCard: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));
function CalendarEventCard({
  event,
  status,
}: {
  event: BirthdayEvent | GameEvent | ScoutEvent;
  status: GameEventStatus;
}) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();
  return (
    <HoverCard
      withinPortal={true}
      position="top"
      width={200}
      shadow="xs"
      withArrow
    >
      <HoverCard.Target>
        <Badge
          px={2}
          fullWidth
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
          className={classes.eventCard}
          component={Link}
          href={
            event.type === "birthday"
              ? `/characters/${(event as BirthdayEvent).character_id}`
              : (event as GameEvent).event_id
              ? `/events/${(event as GameEvent).event_id}`
              : `/scouts/${(event as ScoutEvent).gacha_id}`
          }
          sx={(theme) => ({
            borderRadius: theme.radius.sm,
            borderWidth: 0,
            borderLeft:
              status === "start"
                ? `solid ${theme.radius.sm}px ${theme.colors.green[5]}`
                : undefined,
            borderRight:
              status === "end"
                ? `solid ${theme.radius.sm}px ${theme.colors.pink[5]}`
                : undefined,
          })}
          leftSection={
            <Box mt={4}>
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
            </Box>
          }
        >
          {event.type === "birthday"
            ? event.name.split(" ")[0] + "'s birthday"
            : event.type === "feature scout"
            ? event.name.split(" ")[0] + " FS"
            : event.type === "scout"
            ? "SC! " + event.name
            : event.type === "song" || event.type === "tour"
            ? event.story_name
            : event.name}
        </Badge>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Picture
          srcB2={`assets/card_still_full1_${
            event.type === "birthday"
              ? event.banner_id + "_normal"
              : event.banner_id + "_evolution"
          }.png`}
          alt={event.name}
          sx={{
            width: 200,
            height: 80,
            margin: "-12px -16px 8px",
            overflow: "hidden",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            "& picture": {},
          }}
        />
        <Text size="md" weight={700}>
          {event.type === "song"
            ? event.name
            : event.type === "tour"
            ? event.name
            : event.type === "scout"
            ? `SCOUT! ${event.name}`
            : event.type === "feature scout"
            ? `Featured Scout: ${event.name}`
            : event.type === "birthday"
            ? `${event.name}'s Birthday`
            : event.name}
        </Text>
        <Text size="sm" color="dimmed" weight={500}>
          {dayjs(status === "end" ? event.end_date : event.start_date).format(
            "LT z"
          )}
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

export default CalendarEventCard;
