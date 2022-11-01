import {
  Box,
  createStyles,
  Paper,
  Title,
  Text,
  Badge,
  Group,
  Blockquote,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import { IconArrowsShuffle2, IconBus, IconDiamond } from "@tabler/icons";

import Picture from "components/core/Picture";
import { GameEvent, GameUnit } from "types/game";
import { useDayjs } from "services/libraries/dayjs";

const useStyles = createStyles((theme, _params, getRef) => ({
  eventCard: {
    display: "flex",
    flexFlow: "row wrap",
    width: "80%",
    margin: "auto",
    marginTop: "2vh",
  },
  eventInfo: {
    position: "relative",
    flex: "2 1 55%",
    padding: "10px 10px 10px 20px",

    ["@media (max-width: 768px)"]: {
      width: "100%",
    },
  },
  eventDate: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },
  eventSummary: {
    fontSize: "11pt",
    marginBottom: "1vh",
  },
}));

function EventCard({
  event,
  units,
  locale,
}: {
  event: GameEvent;
  units: GameUnit[];
  locale: string | undefined;
}) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();

  return (
    <Paper
      component={Link}
      href={`/events/${event.event_id}`}
      shadow="xs"
      withBorder
      className={classes.eventCard}
    >
      <Box sx={{ position: "relative", flex: "1 1 45%" }}>
        <Picture
          alt={event.name}
          srcB2={`assets/card_still_full1_${event.banner_id}_evolution.png`}
          radius="sm"
          sx={(theme) => ({
            height: 250,
            minHeight: 150,
          })}
        />
      </Box>
      <Box className={classes.eventInfo}>
        <Group noWrap>
          <Title order={3} sx={{ width: "75%" }}>
            {event.name}
          </Title>
          <Badge
            variant="filled"
            color={
              event.type === "song"
                ? "grape"
                : event.type === "shuffle"
                ? "blue"
                : "teal"
            }
            leftSection={
              <Box mt={4}>
                {event.type === "song" ? (
                  <IconDiamond size={12} strokeWidth={3} />
                ) : event.type === "shuffle" ? (
                  <IconArrowsShuffle2 size={12} strokeWidth={3} />
                ) : (
                  <IconBus size={12} strokeWidth={3} />
                )}
              </Box>
            }
          >
            {event.type}
          </Badge>
        </Group>
        <Group>
          <Text size="sm" className={classes.eventDate}>
            {dayjs(event.start_date).format("lll")}
            {" - "}
            {dayjs(event.end_date).format("lll z")}
          </Text>
          {dayjs(event.start_date).isAfter(dayjs()) && (
            <Tooltip
              multiline
              width={250}
              label="This event has not occured yet and this date range will be updated when official dates are provided."
              position="bottom"
              withArrow
            >
              <Badge color="red" variant="dot">
                Estimate
              </Badge>
            </Tooltip>
          )}
          {dayjs().isBetween(
            dayjs(event.start_date),
            dayjs(event.end_date)
          ) && (
            <Badge color="yellow" variant="dot">
              Ongoing
            </Badge>
          )}
        </Group>

        <Blockquote className={classes.eventSummary}>
          {event.intro_lines || "Event description to be announced soon."}
        </Blockquote>
        <Box>
          {units.length > 0 && (
            <Group
              sx={{
                position: "absolute",
                bottom: 0,
                marginBottom: "1vh",
                paddingTop: "5px",
              }}
            >
              {units.map((unit) => (
                <Text
                  key={unit.id}
                  size="xs"
                  weight={600}
                  sx={(theme) => ({
                    background: `${unit.image_color}44`,
                    color: unit.image_color,
                    padding: "2px 8px",
                    borderRadius: theme.radius.lg,
                  })}
                >
                  {unit.name[0]}
                </Text>
              ))}
            </Group>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default EventCard;
