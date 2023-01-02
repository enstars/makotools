import { Badge, Box, Group, Paper, Text } from "@mantine/core";
import {
  IconAward,
  IconBus,
  IconCake,
  IconDiamond,
  IconExclamationMark,
  IconPlayerPlay,
  IconShirt,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import Link from "next/link";

import Picture from "components/core/Picture";
import { useDayjs } from "services/libraries/dayjs";
import { Birthday, Event, GameEventStatus, Scout } from "types/game";
import useTranslation from "next-translate/useTranslation";

// const useStyles = createStyles((theme, _params, getRef) => ({

//   listCard: {
//     display: "block",
//     position: "relative",
//     width: "100%",
//   },
// }));

function CalendarListEventCard({
  index,
  eventsAmt,
  event,
  status,
}: {
  index: number;
  eventsAmt: number;
  event: Birthday | Event | Scout;
  status?: GameEventStatus;
}) {
  const { t } = useTranslation("calendar");
  // const { classes } = useStyles();
  const { dayjs } = useDayjs();
  const [isMobile, setMobile] = useState<boolean>(true);

  useEffect(() => {
    window.innerWidth < 900 ? setMobile(true) : setMobile(false);
  }, []);

  return (
    <Paper
      withBorder
      component={Link}
      // className={classes.listCard}
      href={
        event.type === "birthday"
          ? `/characters/${(event as Birthday).character_id}`
          : (event as Event).event_id
          ? `/events/${(event as Event).event_id}`
          : `/scouts/${(event as Scout).gacha_id}`
      }
      mb="xs"
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        overflow: "hidden",
      }}
    >
      <Picture
        srcB2={`assets/card_still_full1_${
          event.type === "birthday"
            ? event.banner_id + "_normal"
            : event.banner_id + "_evolution"
        }.png`}
        alt={event.name[0]}
        sx={{
          width: "100%",
          height: 120,
          maxWidth: 400,
          minWidth: 200,
          flex: "1 1 100px",
        }}
      />
      <Box
        px="md"
        py="xs"
        sx={{
          minWidth: 200,
          flex: "2 1 100px",
        }}
      >
        <Group spacing={4} mb={4}>
          <Badge
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
            sx={(theme) => ({})}
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
            {t("game__campaignTypes:" + event.type)}
          </Badge>
          {status === "start" ? (
            <Badge variant="filled" color="green" px={4} pt={3}>
              <IconPlayerPlay size={12} strokeWidth={3} />
            </Badge>
          ) : status === "end" ? (
            <Badge variant="filled" color="red" px={4} pt={3}>
              <IconExclamationMark size={12} strokeWidth={3} />
            </Badge>
          ) : undefined}
        </Group>
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
      </Box>
    </Paper>
  );
}

export default CalendarListEventCard;
