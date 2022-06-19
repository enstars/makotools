import React from "react";
import Link from "next/link";
// import Image from "next/image";
import { getData, getB2File } from "../../services/ensquare";
import { twoStarIDs } from "../../data/characterIDtoCardID";
import {
  Card,
  Paper,
  Group,
  Box,
  Text,
  Badge,
  Image,
  BackgroundImage,
} from "@mantine/core";
import { IconStar } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";

const attributes = [
  {},
  { name: "Sp", color: "red" },
  { name: "Br", color: "lightblue" },
  { name: "Gl", color: "green" },
  { name: "Fl", color: "yellow" },
];

export default function CardCard({ i, cards }) {
  const card = cards.main.data[i];
  const cardMainLang = cards.localized[0].data[i];
  const cardSubLang = cards.localized[1].data?.[i] || undefined;
  // console.log(card);
  return (
    // <Link passHref>
    <Card
      withBorder
      // component="a"
      p="xs"
      onClick={() =>
        showNotification({
          title: "The card pages aren't available yet!",
          // message: "Hey there, your code is awesome! 🤥",
        })
      }
    >
      <Card.Section>
        <Group spacing={0} grow>
          {["normal", "evolution"].map((type) => (
            <BackgroundImage
              key={type}
              sx={{
                position: "relative",
                height: 100,
                flexBasis: 0,
                flexShrink: 1,
                flexGrow: 1,
                maxWidth: "100%",
                transition: "0.2s ease",
                "&:hover": { flexGrow: 2 },
              }}
              src={getB2File(`cards/card_square1_${card.id}_${type}.png`)}
              alt={card.title}
              fit="cover"
            />
          ))}
        </Group>
      </Card.Section>
      <Box mt="xs">
        <Text
          size="sm"
          weight="700"
        >{`(${cardMainLang.title}) ${cardMainLang.name}`}</Text>
        {cardSubLang && (
          <Text
            size="xs"
            color="dimmed"
            weight="500"
          >{`(${cardSubLang.title}) ${cardSubLang.name}`}</Text>
        )}
      </Box>
      <Group mt="xs" spacing={3}>
        <Badge
          color={attributes[card.type].color}
          sx={{
            textTransform: "none",
            fontFeatureSettings: "'ss02' 1",
          }}
        >
          {attributes[card.type].name} {card.rarity}
          <IconStar size={10} style={{ verticalAlign: -1 }} />
        </Badge>
        <Badge
          sx={{
            textTransform: "none",
          }}
        >
          40k
        </Badge>
      </Group>
    </Card>
    // </Link>
  );
}
