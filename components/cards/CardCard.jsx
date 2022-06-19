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
  useMantineTheme,
} from "@mantine/core";
import { IconStar, IconSum } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";

const attributes = [
  {},
  { name: "Sp", color: "red" },
  { name: "Br", color: "lightblue" },
  { name: "Gl", color: "green" },
  { name: "Fl", color: "yellow" },
];

export default function CardCard({ i, cards, id, characters }) {
  const theme = useMantineTheme();
  const card = cards.main.data.find((c) => c.id === id);
  const cardMainLang = cards.localized[0].data.find((c) => c.id === id);
  const cardSubLang =
    cards.localized[1].data?.find((c) => c.id === id) || undefined;
  // console.log(card);
  return (
    // <Link passHref>
    <Card
      withBorder
      // component="a"
      p="sm"
      onClick={() =>
        showNotification({
          title: "The card pages aren't available yet!",
          // message: "Hey there, your code is awesome! 🤥",
        })
      }
    >
      <Card.Section sx={{ position: "relative" }}>
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
                "&:hover": { flexGrow: 1.25 },
              }}
              src={getB2File(`cards/card_square1_${card.id}_${type}.png`)}
              alt={card.title}
              fit="cover"
            />
          ))}
        </Group>
        <Paper
          component={Box}
          color={attributes[card.type].color}
          variant="filled"
          sx={{
            position: "absolute",
            bottom: -2,
            left: -12.5,
            borderTopRightRadius: theme.radius.sm,
            transform: "skew(15deg)",
            pointerEvents: "none",
            //attributes[card.type].color
            borderBottom: `solid 2px ${
              theme.colors[attributes[card.type].color][5]
            }`,
          }}
          pl={20}
          pr={10}
          py={2}
          radius={0}
        >
          <Text
            size="xs"
            weight="700"
            sx={{
              transform: "skew(-15deg)",
              fontFeatureSettings: "'kern' 1, 'ss02' 1",
            }}
          >
            {attributes[card.type].name} {card.rarity}
            <IconStar size={10} strokeWidth={3} style={{ verticalAlign: -1 }} />
          </Text>
        </Paper>
        <Paper
          component={Box}
          sx={{
            position: "absolute",
            bottom: -2,
            right: -12.5,
            borderTopLeftRadius: theme.radius.sm,
            transform: "skew(-15deg)",
            pointerEvents: "none",
            borderBottom: `solid 2px ${
              characters.find((c) => c.character_id === card.character_id)
                .image_color
            }`,
          }}
          pl={10}
          pr={20}
          py={2}
          radius={0}
        >
          <Text
            size="xs"
            weight="700"
            sx={{
              transform: "skew(15deg)",
            }}
          >{`${cardMainLang?.name?.split(" ")?.[0]}`}</Text>
        </Paper>
      </Card.Section>
      <Box mt="xs">
        <Text size="sm" weight="700">{`${cardMainLang.title}`}</Text>
        {cardSubLang && (
          <Text
            size="xs"
            color="dimmed"
            weight="500"
          >{`${cardSubLang.title}`}</Text>
        )}
      </Box>
      <Group spacing={3} sx={{ justifyContent: "flex-end" }}>
        {card?.stats?.ir[0] && (
          <Text
            weight="700"
            size="md"
            sx={{
              fontVariantNumeric: "tabular-nums",
            }}
            inline
          >
            <Text inline component="span" color="dimmed" mr={2}>
              <IconSum
                size={18}
                style={{ verticalAlign: -3 }}
                strokeWidth={2.5}
              />
            </Text>
            {card.stats.ir[0] + card.stats.ir[1] + card.stats.ir[2]}
          </Text>
        )}
      </Group>
    </Card>
    // </Link>
  );
}
