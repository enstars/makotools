import React, { useEffect } from "react";
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
  useMantineColorScheme,
} from "@mantine/core";
import { IconStar, IconSum } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";

let ReactGlobalize = require("react-globalize");
let Globalize = require("globalize");
let FormatNumber = ReactGlobalize.FormatNumber;

Globalize.load(
  require("cldr-data/supplemental/likelySubtags"),
  require("cldr-data/supplemental/numberingSystems"),
  require("cldr-data/supplemental/plurals"),
  require("cldr-data/supplemental/ordinals")
);

const attributes = [
  {},
  { name: "Sp", color: "red" },
  { name: "Br", color: "lightblue" },
  { name: "Gl", color: "green" },
  { name: "Fl", color: "yellow" },
];

export default function CardCard({ i, cards, id, characters }) {
  const { locale } = useRouter();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const card = cards.main.data.find((c) => c.id === id);
  const cardMainLang = cards.localized[0].data.find((c) => c.id === id);
  const cardSubLang =
    cards.localized[1].data?.find((c) => c.id === id) || undefined;
  // console.log(card);

  Globalize.load(
    require(`cldr-data/main/${locale}/numbers`),
    require(`cldr-data/main/${locale}/units`)
  );

  return (
    <Link passHref href={`cards/${id}`}>
      <Card withBorder component="a" p="sm">
        <Card.Section sx={{ position: "relative" }} p={3}>
          <Group grow sx={{ "&:hover div": { opacity: 0.25 } }} spacing={3}>
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
                  transition: "0.3s cubic-bezier(.19,.73,.37,.93)",
                  "&&:hover": { flexGrow: 2.5, opacity: 1 },
                  backgroundPosition: "top",
                }}
                src={getB2File(
                  card.rarity >= 4
                    ? `assets/card_still_full1_${card.id}_${type}.png` // 4-5 -> full cg
                    : `assets/card_rectangle4_${card.id}_${type}.png` // 1-3 -> frameless
                )}
                alt={card.title}
                fit="cover"
                radius={3}
              />
            ))}
          </Group>
          {/* <Paper
            component={Box}
            color={attributes[card.type].color}
            variant="filled"
            sx={{
              position: "absolute",
              bottom: 0,
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
              <IconStar
                size={10}
                strokeWidth={3}
                style={{ verticalAlign: -1 }}
              />
            </Text>
          </Paper>
          <Paper
            component={Box}
            sx={{
              position: "absolute",
              bottom: 0,
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
          </Paper> */}
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
        <Group spacing={3} sx={{ justifyContent: "space-between" }} mt={3}>
          <Text
            size="sm"
            weight="700"
            sx={{
              textTransform: "none",
              fontFeatureSettings: "'kern' 1, 'ss02' 1",
              display: "flex",
            }}
          >
            <Text
              inherit
              color={
                colorScheme === "dark"
                  ? theme.colors.yellow[2]
                  : theme.colors.yellow[7]
              }
              mr={4}
            >
              {card.rarity}
              <IconStar
                size={12}
                strokeWidth={3}
                style={{ verticalAlign: -1 }}
              />
              {/* {[...Array(card.rarity)].map((e, i) => (
                <IconStar
                  key={e}
                  size={12}
                  strokeWidth={3}
                  style={{ verticalAlign: -1, marginRight: 2 }}
                />
              ))} */}
            </Text>
            <Text inherit color={attributes[card.type].color} mr={4}>
              {attributes[card.type].name}
            </Text>
            <Text inherit color="dimmed">{`${
              cardMainLang?.name?.split(" ")?.[0]
            }`}</Text>
          </Text>
          {card?.stats?.ir[0] && (
            <Text
              weight="700"
              size="sm"
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
              <FormatNumber
                locale={locale}
                options={{
                  compact: "short",
                  minimumSignificantDigits: 2,
                  maximumSignificantDigits: 2,
                }}
              >
                {card.stats.ir[0] + card.stats.ir[1] + card.stats.ir[2]}
              </FormatNumber>
              {" / "}
              <FormatNumber
                locale={locale}
                options={{
                  compact: "short",
                  minimumSignificantDigits: 2,
                  maximumSignificantDigits: 2,
                }}
              >
                {/* {card.stats.ir[0] + card.stats.ir[1] + card.stats.ir[2]} */}
                {card.stats.ir4[0] + card.stats.ir4[1] + card.stats.ir4[2]}
              </FormatNumber>
            </Text>
          )}
        </Group>
      </Card>
    </Link>
  );
}
