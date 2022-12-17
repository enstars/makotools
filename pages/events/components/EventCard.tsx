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
} from "@mantine/core";
import Link from "next/link";
import { IconArrowsShuffle2, IconBus, IconDiamond } from "@tabler/icons";

import Picture from "components/core/Picture";
import { GameEvent, GameUnit } from "types/game";
import { useDayjs } from "services/libraries/dayjs";
import IconEnstars from "components/core/IconEnstars";

const useStyles = createStyles((theme) => ({
  eventCard: {
    display: "flex",
    flexFlow: "row wrap",
    width: "100%",
    margin: "auto",
    overflow: "hidden",
    marginBottom: theme.spacing.xs,
  },
  eventInfo: {
    position: "relative",
    flex: "2 1 60%",
    minWidth: 200,
    rowGap: 0,
    columnGap: theme.spacing.md,
  },
  eventInfoText: {
    "&&&&&": {
      flex: "2 1 60%",
      minWidth: 200,
      maxWidth: 500,
    },
  },
  eventInfoDates: {
    "&&&&&": {
      flex: "1 1 30%",
      minWidth: 200,
    },
  },
  eventSummary: {
    fontSize: "11pt",
    marginBottom: "1vh",
  },
}));

function EventCard({ event, units }: { event: GameEvent; units: GameUnit[] }) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();

  let eventUnits: GameUnit[] = units.filter((unit: GameUnit) => {
    return event.unit_id ? event.unit_id?.includes(unit.id) : false;
  });

  const isEstimatedDate = dayjs(event.start_date).isAfter(dayjs());
  const isOngoing = dayjs().isBetween(
    dayjs(event.start_date),
    dayjs(event.end_date)
  );

  return (
    <Paper
      component={Link}
      href={`/events/${event.event_id}`}
      withBorder
      className={classes.eventCard}
    >
      <Box sx={{ position: "relative", flex: "1 1 30%", minWidth: 175 }}>
        <Picture
          alt={event.name}
          srcB2={`assets/card_still_full1_${event.banner_id}_evolution.png`}
          sx={(theme) => ({
            height: "100%",
            minHeight: 150,
          })}
        />
      </Box>
      <Group className={classes.eventInfo} align="start" px="md" py="sm">
        <Box className={classes.eventInfoText}>
          <Title order={3}>
            {event.name[0]}
            {isOngoing && (
              <Badge
                ml="xs"
                color="yellow"
                variant="filled"
                size="md"
                sx={{ verticalAlign: 3 }}
              >
                Ongoing
              </Badge>
            )}
          </Title>

          <Text className={classes.eventSummary}>
            {event.intro_lines?.[0] ||
              "Event description to be announced soon."}
          </Text>
        </Box>
        <Box className={classes.eventInfoDates}>
          <Stack spacing={0}>
            <Group spacing="xs">
              <Badge
                size="lg"
                variant="filled"
                color={
                  event.type === "song"
                    ? "grape"
                    : event.type === "shuffle"
                    ? "hokke"
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
                {event.type}
              </Badge>

              {eventUnits.map((unit) => (
                <ThemeIcon
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
            <Group
              sx={(theme) => ({
                rowGap: theme.spacing.xs,
                columnGap: theme.spacing.md,
              })}
              mt="xs"
            >
              <Box sx={{ flex: "1 1 0", minWidth: 185 }}>
                <Text size="xs" color="dimmed" weight={700}>
                  Start ({dayjs(event.start_date).format("z")})
                </Text>
                <Text weight={500}>
                  {dayjs(event.start_date).format("lll")}
                </Text>
              </Box>
              <Box sx={{ flex: "1 1 0", minWidth: 185 }}>
                <Text size="xs" color="dimmed" weight={700}>
                  End ({dayjs(event.end_date).format("z")})
                </Text>
                <Text weight={500}>{dayjs(event.end_date).format("lll")}</Text>
              </Box>
            </Group>

            {isEstimatedDate && (
              <Tooltip
                multiline
                width={250}
                label="This event is not available on the global server yet."
                position="bottom-start"
                withArrow
                p="sm"
              >
                <Text color="dimmed" size="xs">
                  Dates are estimates
                </Text>
              </Tooltip>
            )}
          </Stack>
        </Box>
      </Group>
    </Paper>
  );
}

export default EventCard;
