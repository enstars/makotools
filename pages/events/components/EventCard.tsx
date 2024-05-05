import {
  Box,
  createStyles,
  Paper,
  Title,
  Text,
  Badge,
  Group,
  Tooltip,
  Stack,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { IconArrowsShuffle2, IconBus, IconDiamond } from "@tabler/icons-react";
import { UseListStateHandlers, useMediaQuery } from "@mantine/hooks";
import useTranslation from "next-translate/useTranslation";

import Picture from "components/core/Picture";
import { Event, GameRegion, GameUnit } from "types/game";
import { useDayjs } from "services/libraries/dayjs";
import IconEnstars from "components/core/IconEnstars";
import useUser from "services/firebase/user";
import WrappableText from "components/core/WrappableText";
import BookmarkButton from "components/core/BookmarkButton";

const useStyles = createStyles((theme) => ({
  eventCard: {
    display: "flex",
    flexFlow: "row wrap",
    width: "100%",
    margin: "0 auto",
    overflow: "hidden",
    alignSelf: "stretch",
    position: "relative",
  },
  eventInfo: {
    flex: "2 1 60%",
    minWidth: 200,
    rowGap: 0,
    columnGap: theme.spacing.md,
  },
  eventInfoText: {
    "&&&": {
      flex: "2 1 60%",
      minWidth: 200,
      maxWidth: 500,
    },
  },
  eventInfoDates: {
    "&&&": {
      flex: "1 1 30%",
      minWidth: 200,
    },
  },
  eventSummary: {
    fontSize: "11pt",
    marginBottom: "1vh",
  },
}));

function EventCard({
  event,
  units,
  bookmarked,
  bookmarks,
  bookmarkHandlers,
  region,
  density,
}: {
  event: Event;
  units: GameUnit[];
  bookmarked: boolean;
  bookmarks: number[];
  bookmarkHandlers: UseListStateHandlers<number>;
  region: GameRegion;
  density: "full" | "compact";
}) {
  const { t } = useTranslation("events");
  const user = useUser();
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { dayjs } = useDayjs();

  const isMobile = useMediaQuery("(max-width: 768px)");

  let eventUnits: GameUnit[] = units.filter((unit: GameUnit) => {
    return event.unit_id ? event.unit_id?.includes(unit.id) : false;
  });

  const isEstimatedDate = dayjs(event.start[region]).isAfter(dayjs());
  const isOngoing = dayjs().isBetween(
    dayjs(event.start[region]),
    dayjs(event.end[region])
  );

  // unknown if value is 0 or is undefined / not defined properly
  const unknownDate = !event.start[region] || !event.end[region];

  return (
    <Paper
      withBorder
      className={classes.eventCard}
      component={Link}
      href={`/events/${event.event_id}`}
    >
      <BookmarkButton
        id={event.event_id}
        type="event"
        mr={theme.spacing.xs}
        inCard
      />
      <Box
        sx={{
          position: "relative",
          flex: "1 1 30%",
          minWidth: density === "compact" ? 50 : 175,
        }}
      >
        <Picture
          alt={event.name[0]}
          srcB2={`assets/card_still_full1_${event.banner_id}_evolution.png`}
          sx={(theme) => ({
            height: "100%",
            minHeight: 150,
          })}
        />
      </Box>
      <Group
        className={classes.eventInfo}
        align="start"
        px="md"
        py="sm"
        sx={{
          flexDirection: density === "compact" ? "column" : "row",
          flexWrap: density === "compact" ? "nowrap" : "wrap",
        }}
      >
        <Box
          className={density === "compact" ? "" : classes.eventInfoText}
          sx={{ "&&&": { flexGrow: 1 } }}
        >
          {density === "compact" && (
            <>
              <Text weight={700} size="md" mb="xs" pr="xl">
                <WrappableText text={event.name[0]} />
              </Text>
            </>
          )}
          {density === "full" && (
            <>
              <Title order={3} pr={32}>
                {event.name[0]}
              </Title>
              <Text className={classes.eventSummary}>
                {event.intro_lines?.[0] || t("event.tbaDesc")}
              </Text>
            </>
          )}
        </Box>
        <Box className={density === "compact" ? "" : classes.eventInfoDates}>
          <Stack spacing={0}>
            <Group
              spacing={density === "compact" ? theme.spacing.xs / 2 : "xs"}
            >
              {isOngoing && (
                <Badge
                  size={density === "compact" ? "sm" : "lg"}
                  color="yellow"
                  variant="filled"
                  sx={{ verticalAlign: 3 }}
                >
                  Ongoing
                </Badge>
              )}
              <Badge
                size={density === "compact" ? "sm" : "lg"}
                variant="filled"
                color={
                  event.type === "song"
                    ? "grape"
                    : event.type === "shuffle"
                    ? "toya_default"
                    : "teal"
                }
                leftSection={
                  <Box mt={4}>
                    {event.type === "song" ? (
                      <IconDiamond size={14} strokeWidth={3} />
                    ) : event.type === "shuffle" ? (
                      <IconArrowsShuffle2 size={14} strokeWidth={3} />
                    ) : (
                      <IconBus size={14} strokeWidth={3} />
                    )}
                  </Box>
                }
              >
                {t(event.type)}
              </Badge>

              {eventUnits.map((unit) => (
                <ThemeIcon
                  size={density === "compact" ? 18 : "md"}
                  key={unit.id}
                  color={unit.image_color}
                  sx={(theme) => ({
                    borderRadius: theme.radius.lg,
                  })}
                >
                  <IconEnstars unit={unit.id} size={14} />
                </ThemeIcon>
              ))}
            </Group>
            {unknownDate ? (
              <Text color="dimmed" size="sm" mt="sm">
                {t("event.dateUnknown")}
              </Text>
            ) : (
              <>
                {density === "compact" && (
                  <>
                    <Text size="sm" weight={500} mt="xs" color="dimmed">
                      {dayjs(event.start[region])
                        .format("ll")
                        ?.replace(
                          // remove years from date
                          /, \d{4}/,
                          ""
                        )
                        ?.trim()
                        ?.replace(
                          // remove hanging punctuation if any
                          /,$/,
                          ""
                        )}
                      {" – "}
                      {dayjs(event.end[region]).format("ll")}
                      {isEstimatedDate && (
                        <Tooltip
                          multiline
                          width={250}
                          label={t("event.estimateDesc")}
                          position="bottom-start"
                          withArrow
                          p="sm"
                          inline
                        >
                          <Text span inline color="dimmed" size="xs">
                            {" "}
                            {t("event.estimateCompact")}
                          </Text>
                        </Tooltip>
                      )}
                    </Text>
                  </>
                )}
                {density === "full" && (
                  <>
                    <Group
                      sx={(theme) => ({
                        rowGap: theme.spacing.xs,
                        columnGap: theme.spacing.md,
                      })}
                      mt="xs"
                    >
                      <Box sx={{ flex: "1 1 0", minWidth: 185 }}>
                        <Text size="xs" color="dimmed" weight={700}>
                          {t("event.start")} (
                          {dayjs(event.start[region]).format("z")})
                        </Text>
                        <Text weight={500}>
                          {dayjs(event.start[region]).format("lll")}
                        </Text>
                      </Box>
                      <Box sx={{ flex: "1 1 0", minWidth: 185 }}>
                        <Text size="xs" color="dimmed" weight={700}>
                          {t("event.end")} (
                          {dayjs(event.end[region]).format("z")})
                        </Text>
                        <Text weight={500}>
                          {dayjs(event.end[region]).format("lll")}
                        </Text>
                      </Box>
                    </Group>
                    {isEstimatedDate && (
                      <Tooltip
                        multiline
                        width={250}
                        label={t("event.estimateDesc")}
                        position="bottom-start"
                        withArrow
                        p="sm"
                      >
                        <Text color="dimmed" size="xs">
                          {t("event.estimate")}
                        </Text>
                      </Tooltip>
                    )}
                  </>
                )}
              </>
            )}
          </Stack>
        </Box>
      </Group>
    </Paper>
  );
}

export default EventCard;
