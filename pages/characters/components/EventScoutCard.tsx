import { Box, useMantineTheme, Text, Paper, Group } from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import { createRef } from "react";
import { useDayjs } from "services/libraries/dayjs";
import { GameCard, Event, Scout } from "types/game";
import Picture from "components/core/Picture";
import { isGameEvent } from "services/utilities";

export function EventScoutCard({
  event,
  card,
}: {
  event: Event | Scout;
  card: GameCard;
}) {
  const { dayjs } = useDayjs();
  const theme = useMantineTheme();
  const nameRef = createRef<HTMLHeadingElement>();

  const cardRarityStars = new Array(card.rarity);
  for (let i = 0; i < cardRarityStars.length; i++) {
    cardRarityStars[i] = i + 1;
  }
  return (
    <Paper
      component="a"
      href={`/${isGameEvent(event) ? "events" : "scouts"}/${
        isGameEvent(event) ? event.event_id : event.gacha_id
      }`}
      shadow="xs"
      sx={{
        position: "relative",
        // width: 325,
        // height: 150,
        overflow: "hidden",
        transition: "transform 0.2s ease",
        "&:hover": {
          "& img": {
            transform: "scale(1.05)",
          },

          "& .rarity-stars": {
            transform: "translateX(-200px)",
          },
        },
      }}
      withBorder
    >
      <Picture
        alt={event.name[0]}
        srcB2={`assets/card_still_full1_${event.banner_id}_evolution.png`}
        sx={(theme) => ({
          // position: "absolute",
          // top: 0,
          // left: 0,
          width: "100%",
          height: 150,
        })}
      />
      <Paper
        className="rarity-stars"
        shadow="sm"
        px="md"
        py="xs"
        sx={{
          position: "absolute",
          top: 10,
          left: -theme.spacing.md * 1.25,
          zIndex: 4,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          transform: "skew(-15deg) translateX(0px)",
          transition: "transform 0.4s ease",
          background: "#000A",
          color: "#fff",
        }}
      >
        <Group
          spacing={theme.spacing.xs / 3}
          sx={{
            paddingLeft: 20,
            flexDirection: "row-reverse",
            transform: "skew(15deg)",
          }}
        >
          {cardRarityStars.map((star) => {
            return <IconStarFilled size={16} key={star} color="#fff" />;
          })}
        </Group>
      </Paper>
      <Box
        className="summary"
        // pos="absolute"
        sx={
          {
            // left: 8,
            // bottom: 4,
            // transform: `translateY(${summaryHeight}px)`,
            // transition: "transform 0.5s ease",
            // zIndex: 3,
          }
        }
        px="md"
        py="md"
      >
        <Text weight={700}>{event.name[0]}</Text>

        <Text weight={500} color="dimmed">
          {dayjs(event.start.en).format("ll")}
          {" - "}
          {dayjs(event.end.en).format("ll")}
        </Text>
      </Box>
      <Box
        className="event-card-bg"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "linear-gradient(transparent, #000000dd)",
          zIndex: 2,
          transition: "background 0.2s",
        }}
      />
    </Paper>
  );
}
