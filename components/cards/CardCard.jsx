import React, { useEffect } from "react";
import CardStatsShort from "../core/CardStatsShort";
import { getB2File } from "../../services/ensquare";
import {
  Card,
  Paper,
  Group,
  Box,
  Text,
  Badge,
  Image,
  Divider,
  Tooltip,
  Skeleton,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconStar, IconSum } from "@tabler/icons";
import { useRouter } from "next/router";
import attributes from "../../data/attributes.json";
import ImageViewer from "../../components/core/ImageViewer";
import OfficialityBadge from "../OfficialityBadge";

function RarityBadge({ card }) {
  const theme = useMantineTheme();
  return (
    <Paper
      component={Box}
      variant="filled"
      sx={{
        position: "absolute",
        top: 9,
        left: -12.5,
        borderTopRightRadius: theme.radius.sm,
        borderBottomRightRadius: theme.radius.sm,
        transform: "skew(-15deg)",
        pointerEvents: "none",
        background: card.type
          ? theme.colors[attributes[card.type]?.color][7]
          : null,
        zIndex: 12,
        transition: "0.3s cubic-bezier(.19,.73,.37,.93)",
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
          transform: "skew(15deg)",
          fontFeatureSettings: "'kern' 1, 'ss02' 1",
        }}
        color="white"
      >
        {card.rarity}
        <IconStar size={10} strokeWidth={3} style={{ verticalAlign: -1 }} />
      </Text>
    </Paper>
  );
}

export default function CardCard({ cards, id, cardOptions }) {
  const router = useRouter();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const card = cards.main.data.find((c) => c.id === id);
  const cardMainLang = cards.localized[0].data.find((c) => c.id === id);
  const cardSubLang =
    cards.localized[1].data?.find((c) => c.id === id) || undefined;

  const statsIR = card.stats.ir.da + card.stats.ir.vo + card.stats.ir.pf;
  const statsIR4 = card.stats.ir4.da + card.stats.ir4.vo + card.stats.ir4.pf;


  return (
    <Card
      withBorder
      p={0}
      onClick={() => {
        router.push(`cards/${id}`);
      }}
      sx={{ "&:hover": { cursor: "pointer" } }}
    >
      <Card.Section sx={{ position: "relative" }} px={3} pt={3}>
        <Group
          grow
          sx={{
            "&:hover .mantine-Image-imageWrapper": { opacity: 0.25 },
          }}
          spacing={3}
        >
          {["normal", "evolution"].map((type) => (
            <ImageViewer
              key={type}
              styles={{
                figure: {
                  height: "100%",
                  "&:hover > figcaption > div": {
                    left: -12.5 - 30,
                  },
                  "&&&:hover > div": { opacity: 0.9 },
                },
                imageWrapper: {
                  height: "100%",
                  transition: theme.other.transition,
                },
                image: {
                  objectFit: "cover",
                  objectPosition: "top center",
                },
              }}
              sx={{
                position: "relative",
                height: 100,
                flexBasis: 0,
                flexShrink: 1,
                flexGrow: 1,
                maxWidth: "100%",
                "&:hover": { flexGrow: card.rarity >= 4 ? 2.5 : 1.1 },
                transition: theme.other.transition,
              }}
              src={getB2File(
                card.rarity >= 4
                  ? `assets/card_still_full1_${card.id}_${type}.png` // 4-5 -> full cg
                  : `assets/card_rectangle4_${card.id}_${type}.png` // 1-3 -> frameless
              )}
              alt={card.title}
              radius={3}
              height="100%"
              withPlaceholder
              placeholder={
                <>
                  <Skeleton width="100%" height="100%" />
                </>
              }
              caption={type === "normal" && <RarityBadge card={card} />}
            />
          ))}
        </Group>
      </Card.Section>
      <Card.Section px="sm" pt="xs">
        <Text size="sm" weight="700">
          {`${cardMainLang.title}`}&nbsp;
          <OfficialityBadge langData={cards.localized[0]} />
        </Text>
        {cardSubLang && (
          <Text size="xs" color="dimmed" weight="500">
            {`${cardSubLang.title}`}&nbsp;
            <OfficialityBadge langData={cards.localized[1]} />
          </Text>
        )}
      </Card.Section>
      <Divider my="xs" size="xs" />
      <Card.Section
        px="sm"
        pb="xs"
        sx={{
          whiteSpace: "nowrap",
        }}
      >
        <Group
          spacing={3}
          sx={{ justifyContent: "space-between", flexWrap: "nowrap" }}
          mt={3}
        >
          {cardOptions.showFullInfo ? (
            <Text
              inline
              size="sm"
              weight="700"
              sx={{
                textTransform: "none",
                fontFeatureSettings: "'kern' 1, 'ss02' 1",
                display: "flex",
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                minWidth: 0,
              }}
            >
              <Text
                inline
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
              </Text>
              <Tooltip label={attributes[card.type].fullname} withArrow>
                <Text inline inherit color={attributes[card.type].color} mr={4}>
                  {attributes[card.type].name}
                </Text>
              </Tooltip>
              <Text
                inline
                inherit
                color="dimmed"
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >{`${cardMainLang?.name?.split(" ")?.[0]}`}</Text>
            </Text>
          ) : (
            <Box />
          )}
          <Text
            weight="700"
            size="sm"
            sx={{
              whiteSpace: "nowrap",
              flexGrow: 0,
              flexShrink: 0,
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
            <CardStatsShort>{statsIR}</CardStatsShort>
            {card?.rarity === 5 && (
              <>
                <Text component="span" inherit inline color="dimmed">
                  {" / "}
                </Text>
                <CardStatsShort>{statsIR4}</CardStatsShort>
              </>
            )}
          </Text>
        </Group>
      </Card.Section>
    </Card>
  );
}
