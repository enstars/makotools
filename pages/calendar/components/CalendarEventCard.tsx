import Link from "next/link";
import { Card, Container, createStyles, Text } from "@mantine/core";
import { IconCake } from "@tabler/icons";

import { getB2File } from "../../../services/ensquare";
import { twoStarIDs } from "../../../data/characterIDtoCardID";

const useStyles = createStyles((theme, _params, getRef) => ({
  eventCard: {
    padding: "3px 0px 6px 0px !important",
    marginTop: "3px",
    textAlign: "left",
    color: theme.colorScheme === "light" ? theme.colors.gray[0] : "inherit",
    background:
      theme.colorScheme === "dark"
        ? theme.colors.blue[9]
        : theme.colors.blue[4],
    borderRadius: theme.radius.sm,
    "&:hover": {
      cursor: "pointer",
    },
  },
  eventCardText: {
    padding: 0,
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "flex-start",
    justifyContent: "space-around",
    height: "16px",
    maxWidth: "100%",
    margin: "auto",
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
            <Text sx={{ maxHeight: "100%", verticalAlign: "center" }}>
              {event.character_name}
            </Text>
          </Card.Section>
        </Link>
      </Card>
    );
  } else {
    <></>;
  }
}

export default CalendarEventCard;
