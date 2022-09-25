import {
  Badge,
  Button,
  Card,
  createStyles,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCake,
  IconPlayerPlay,
  IconStar,
} from "@tabler/icons";
import Link from "next/link";

import { getB2File } from "services/ensquare";

const useStyles = createStyles((theme, _params, getRef) => ({
  listEventCard: {
    marginTop: "1vh",
  },
  listEventCardImage: {
    width: "320px",
    minHeight: "125px",
    maxHeight: "150px",
    overflow: "clip",
  },
  listEventCardText: {
    padding: "1vh 1vw",
  },
  listEventCardButton: {
    margin: "auto",
    marginTop: "1vh",
  },
}));

function CalendarListEventCard({ ...props }) {
  const { classes } = useStyles();

  return (
    <Card
      withBorder
      className={classes.listEventCard}
      sx={{
        marginBottom: `${
          props.eventsAmt > 1 && props.index < props.eventsAmt - 1
            ? "9.5vh"
            : "0px"
        }`,
      }}
    >
      <Card.Section className={classes.listEventCardImage}>
        <Image
          src={getB2File(
            `assets/card_still_full1_${
              props.event.type === "birthday"
                ? props.event.render_id + "_normal"
                : props.event.render_id + "_evolution"
            }.webp`
          )}
          alt={props.event.name}
          height={280}
          sx={{ marginTop: "-50px" }}
        />
      </Card.Section>
      <Card.Section component="a" className={classes.listEventCardText}>
        <Stack justify="space-around" spacing="md">
          <Text size="lg" weight={600}>
            {props.event.type === "birthday"
              ? props.event.name.split(" ")[0] + "'s birthday"
              : props.event.type === "scout"
              ? "SCOUT! " + props.event.name
              : props.event.type === "feature scout"
              ? "Featured Scout: " + props.event.name.split(" ")[0]
              : props.event.name}
          </Text>
          <Group position="center" align="center">
            <Badge
              color={
                props.event.type === "birthday"
                  ? "cyan"
                  : props.event.type === "anniversary"
                  ? "yellow"
                  : props.event.status === "start"
                  ? "lime"
                  : "pink"
              }
              leftSection={
                props.event.type === "birthday" ? (
                  <IconCake size={16} style={{ marginTop: "3px" }} />
                ) : props.event.type === "anniversary" ? (
                  <IconStar size={16} style={{ marginTop: "3px" }} />
                ) : props.event.status === "start" ? (
                  <IconPlayerPlay size={16} style={{ marginTop: "3px" }} />
                ) : (
                  <IconAlertCircle size={17} style={{ marginTop: "4px" }} />
                )
              }
              sx={{ alignItems: "center", minWidth: "75px", maxWidth: "90px" }}
            >
              {props.event.type === "birthday"
                ? "Birth"
                : props.event.type === "anniversary"
                ? "Anni"
                : props.event.status === "start"
                ? "Start"
                : "End"}
            </Badge>
            {props.event.type !== "anniversary" && (
              <Link
                href={
                  props.event.type === "birthday" ||
                  props.event.type === "feature scout"
                    ? `/characters/${props.event.id}`
                    : `/events/${props.event.id}`
                }
                passHref
              >
                <Button
                  component="a"
                  className={classes.listEventCardButton}
                  color="indigo"
                  variant="subtle"
                  compact
                >
                  {props.event.type === "birthday" ||
                  props.event.type === "feature scout"
                    ? "Visit character page"
                    : "Visit event page"}
                </Button>
              </Link>
            )}
          </Group>
        </Stack>
      </Card.Section>
    </Card>
  );
}

export default CalendarListEventCard;
