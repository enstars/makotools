import { Badge, Box, createStyles, HoverCard, Text } from "@mantine/core";
import {
  IconAward,
  IconBus,
  IconCake,
  IconDiamond,
  IconShirt,
} from "@tabler/icons-react";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

import Picture from "components/core/Picture";
import { useDayjs } from "services/libraries/dayjs";
import { Birthday, Campaign, Event, GameEventStatus, Scout } from "types/game";

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
  event: Campaign;
  status?: GameEventStatus;
}) {
  const { t } = useTranslation("calendar");
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
            event.type === "birthday"
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
              ? `/characters/${(event as Birthday).character_id}`
              : event.type === "scout" || event.type === "feature scout"
              ? `/scouts/${(event as Scout).gacha_id}`
              : `/events/${(event as Event).event_id}`
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
            ? t("monthViewLabels.birthday", {
                name: event.name[0]?.split(" ")?.[0],
              })
            : event.type === "feature scout"
            ? t("monthViewLabels.fs", {
                name: event.name[0]?.split(" ")?.[0],
              })
            : event.type === "scout"
            ? t("monthViewLabels.scout", {
                name: event.name[0],
              })
            : event.type === "song" || event.type === "tour"
            ? t("monthViewLabels.event", {
                name: event?.story_name[0],
              })
            : event.name[0]}
        </Badge>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Picture
          srcB2={`assets/card_still_full1_${
            event.type === "birthday"
              ? event.banner_id + "_normal"
              : event.banner_id + "_evolution"
          }.png`}
          alt={event.name[0]}
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
          {event.type === "song" || event.type === "tour"
            ? t("eventNames.event", {
                name: event.name[0],
              })
            : event.type === "scout"
            ? t("eventNames.scout", {
                name: event.name[0],
              })
            : event.type === "feature scout"
            ? t("eventNames.fs", {
                name: event.name[0],
              })
            : event.type === "birthday"
            ? t("eventNames.birthday", {
                name: event.name[0],
              })
            : event.name[0]}
        </Text>
        <Text size="sm" color="dimmed" weight={500}>
          {dayjs(status === "end" ? event.end.en : event.start.en).format(
            "LT z"
          )}
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

export default CalendarEventCard;
