import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getData, getB2File } from "../../services/ensquare";
import { twoStarIDs } from "../../data/characterIDtoCardID";
import styles from "./CharacterCard.module.scss";
import { Card, Paper, Group, Box, Text, Badge } from "@mantine/core";
import { IconStar } from "@tabler/icons";

const attributes = [
  {},
  { name: "Sp", color: "red" },
  { name: "Br", color: "lightblue" },
  { name: "Gl", color: "green" },
  { name: "Fl", color: "yellow" },
];

export default function CardCard({ i, cards }) {
  const card = cards[0][i];
  const cardSubLang = cards[1]?.[i] || undefined;
  // console.log(characters);
  return (
    <Link href={`/cards/${card.id}`} passHref>
      <Card withBorder component="a" p="xs">
        <Card.Section>
          <Group spacing={0} grow>
            {["normal", "evolution"].map((type) => (
              <Box
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
              >
                <Image
                  src={getB2File(`cards/card_square1_${card.id}_${type}.png`)}
                  alt={card.title}
                  layout="fill"
                  objectFit="cover"
                />
              </Box>
            ))}
          </Group>
        </Card.Section>
        <Box mt="xs">
          <Text size="sm" weight="500">{`(${card.title}) ${card.name}`}</Text>
          {cardSubLang && (
            <Text
              size="xs"
              color="dimmed"
            >{`(${cardSubLang.title}) ${cardSubLang.name}`}</Text>
          )}
        </Box>
        <Group mt="xs" spacing={3}>
          <Badge
            color={attributes[card.type_id].color}
            sx={{
              textTransform: "none",
              fontFeatureSettings: "'ss02' 1",
            }}
          >
            {attributes[card.type_id].name} {card.rare_type_id}
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
    </Link>
  );
}
