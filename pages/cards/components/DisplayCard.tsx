import React, { SyntheticEvent, useState } from "react";
import {
  Card,
  Paper,
  Group,
  Box,
  Text,
  Divider,
  Tooltip,
  useMantineTheme,
  useMantineColorScheme,
  ActionIcon,
  Popover,
  Stack,
} from "@mantine/core";
import {
  IconMinus,
  IconPlaylistAdd,
  IconPlus,
  IconStar,
  IconSum,
} from "@tabler/icons";
import { useRouter } from "next/router";

import attributes from "../../../data/attributes.json";
import OfficialityBadge from "../../../components/utilities/formatting/OfficialityBadge";
import CardStatsNumber from "../../../components/utilities/formatting/CardStatsNumber";
import { addCard } from "../../../services/makotools/collection";
import useUser from "../../../services/firebase/user";
import Picture from "../../../components/core/Picture";
import { Lang } from "../../../types/makotools";

import { sumStats } from "./Stats";

function RarityBadge({ card }: { card: GameCard }) {
  const theme = useMantineTheme();
  return (
    <Paper
      component={Box}
      sx={{
        position: "absolute",
        top: 9,
        left: -12.5,
        borderTopRightRadius: theme.radius.sm,
        borderBottomRightRadius: theme.radius.sm,
        transform: "skew(-15deg)",
        pointerEvents: "none",
        background: card.type
          ? theme.colors[attributes[card.type].color][7]
          : undefined,
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

export default function CardCard({
  card,
  cardOptions,
  lang,
}: {
  card: GameCard;
  cardOptions: any;
  lang: Lang[];
}) {
  const router = useRouter();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const user = useUser();

  const statsIR = sumStats(card.stats?.ir);
  const statsIR4 = sumStats(card.stats?.ir4);

  const collection = (user.loggedIn && user.db?.collection) || [];
  const thisColItem = collection?.find((c) => c.id === card.id);
  const [collectionOpened, setCollectionOpened] = useState(false);

  return (
    <Card
      withBorder
      p={0}
      onClick={() => {
        router.push(`cards/${card.id}`);
      }}
      sx={{ "&:hover": { cursor: "pointer" } }}
    >
      <Card.Section sx={{ position: "relative" }} px={3} pt={3}>
        <Group
          sx={{
            "&:hover picture": { opacity: 0.25 },
          }}
          spacing={3}
        >
          {["normal", "evolution"].map((type) => (
            <Picture
              key={type}
              sx={{
                height: 100,
                flexBasis: 0,
                flexShrink: 1,
                flexGrow: 1,
                maxWidth: "100%",
                transition: theme.other.transition,
                img: {
                  width: "100%",
                  objectPosition: "top center",
                },
                ".mantine-ActionIcon-root": {
                  opacity: 0,
                  transition: theme.other.transition,
                },
                "&&:hover": {
                  flexGrow: card.rarity >= 4 ? 2.5 : 1.1,
                  opacity: 1,
                  ".mantine-ActionIcon-root": {
                    opacity: 1,
                  },

                  ".mantine-Paper-root": {
                    left: -12.5 - 30,
                  },
                },
              }}
              srcB2={
                card.rarity >= 4
                  ? `assets/card_still_full1_${card.id}_${type}.png` // 4-5 -> full cg
                  : `assets/card_rectangle4_${card.id}_${type}.png` // 1-3 -> frameless
              }
              alt={card.title[0]}
              radius={3}
              action="download"
            >
              {type === "normal" && <RarityBadge card={card} />}
            </Picture>
          ))}
        </Group>
      </Card.Section>
      <Card.Section px="sm" pt="xs">
        <Text size="sm" weight="700">
          {`${card.title[0]}`}&nbsp;
          <OfficialityBadge langData={lang[0]} />
        </Text>
        {card.title[1] && (
          <Text size="xs" color="dimmed" weight="500">
            {`${card.title[1]}`}&nbsp;
            <OfficialityBadge langData={lang[1]} />
          </Text>
        )}
      </Card.Section>
      <Divider mt="xs" size="xs" />
      <Card.Section
        sx={{
          whiteSpace: "nowrap",
        }}
      >
        <Group spacing={0} noWrap>
          {!user.loading && user.loggedIn && (
            <Group>
              <Box
                sx={(theme) => ({
                  marginLeft: theme.spacing.xs / 2,
                })}
                onClick={(e: SyntheticEvent) => {
                  e.stopPropagation();
                  if (!thisColItem) {
                    const newCollection = addCard(collection, card.id, 1);
                    user.db.set({ collection: newCollection });
                  } else {
                    setCollectionOpened((o) => !o);
                  }
                }}
              >
                <Popover
                  offset={4}
                  opened={collectionOpened}
                  onChange={setCollectionOpened}
                  styles={{ dropdown: { padding: 0 } }}
                  position="right"
                  withinPortal
                >
                  <Popover.Target>
                    <ActionIcon
                      variant="light"
                      {...(thisColItem && thisColItem?.count > 0
                        ? { color: "orange" }
                        : {})}
                    >
                      {thisColItem && thisColItem?.count > 0 ? (
                        <Text inline size="xs" weight="700">
                          {thisColItem.count}
                          <Text
                            component="span"
                            sx={{ verticalAlign: "-0.05em", lineHeight: 0 }}
                          >
                            ×
                          </Text>
                        </Text>
                      ) : (
                        <IconPlaylistAdd size={16} />
                      )}
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Stack spacing={0}>
                      <ActionIcon
                        variant="subtle"
                        color="green"
                        onClick={(e: SyntheticEvent) => {
                          e.stopPropagation();

                          const newCollection = addCard(collection, card.id, 1);
                          user.db.set({ collection: newCollection });
                        }}
                        disabled={thisColItem && thisColItem?.count >= 5}
                      >
                        <IconPlus size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={(e: SyntheticEvent) => {
                          e.stopPropagation();

                          const newCollection = addCard(
                            collection,
                            card.id,
                            -1
                          );
                          user.db.set({ collection: newCollection });
                        }}
                        disabled={!thisColItem || thisColItem?.count <= 0}
                      >
                        <IconMinus size={16} />
                      </ActionIcon>
                    </Stack>
                  </Popover.Dropdown>
                </Popover>
              </Box>
            </Group>
          )}
          <Group
            px="sm"
            py="xs"
            spacing={3}
            sx={{ flex: "1 1 0", minWidth: 0 }}
            noWrap
            position="apart"
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
                  <Text
                    inline
                    inherit
                    color={attributes[card.type].color}
                    mr={4}
                  >
                    {attributes[card.type].name}
                  </Text>
                </Tooltip>
                <Text
                  inline
                  inherit
                  color="dimmed"
                  sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                >{`${card?.name?.[0]?.split(" ")?.[0]}`}</Text>
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
              <CardStatsNumber short>{statsIR}</CardStatsNumber>
              {card?.rarity === 5 && (
                <>
                  <Text component="span" inherit inline color="dimmed">
                    {" / "}
                  </Text>
                  <CardStatsNumber short>{statsIR4}</CardStatsNumber>
                </>
              )}
            </Text>
          </Group>
        </Group>
      </Card.Section>
    </Card>
  );
}
