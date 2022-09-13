import Link from "next/link";
import { Card, Container, createStyles, Text } from "@mantine/core";
import { IconCake } from "@tabler/icons";

import { getB2File } from "../../../services/ensquare";
import { twoStarIDs } from "../../../data/characterIDtoCardID";

const useStyles = createStyles((theme, _params, getRef) => ({
  eventCard: {
    textAlign: "left",
    background:
      theme.colorScheme === "dark"
        ? theme.colors.blue[9]
        : theme.colors.blue[0],
    borderRadius: theme.radius.sm,
    "&:hover": {
      cursor: "pointer",
    },
  },
  eventCardText: {
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
  },
}));

function CalendarEventCard({ ...props }) {
  const { event } = props;
  const { classes } = useStyles();

  if (event.type === "birthday") {
    return (
      <Card className={classes.eventCard}>
        <Link href={`/characters/${event.character_id}`}>
          <Card.Section component="a" className={classes.eventCardText}>
            <IconCake size={16} />
            <Text>{event.character_name}</Text>
          </Card.Section>
        </Link>
      </Card>
    );
  } else {
    <></>;
  }
}

export default CalendarEventCard;
