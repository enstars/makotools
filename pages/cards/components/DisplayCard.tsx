import React, { useState } from "react";
import {
  Card,
  Paper,
  Group,
  Box,
  Text,
  Divider,
  Tooltip,
  Skeleton,
  useMantineTheme,
  useMantineColorScheme,
  Button,
  ActionIcon,
  Popover,
  Stack,
} from "@mantine/core";
import {
  IconBoxMultiple1,
  IconFilePlus,
  IconMinus,
  IconPlaylistAdd,
  IconPlus,
  IconStar,
  IconSum,
} from "@tabler/icons";
import { useRouter } from "next/router";

import { getB2File } from "../../../services/ensquare";
import attributes from "../../../data/attributes.json";
import ImageViewer from "../../../components/core/ImageViewer";
import OfficialityBadge from "../../../components/utilities/formatting/OfficialityBadge";
import CardStatsNumber from "../../../components/utilities/formatting/CardStatsNumber";
import { addCard } from "../../../services/collection";
import { useFirebaseUser } from "../../../services/firebase/user";
import Picture from "../../../components/core/Picture";

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
  cards,
  id,
  cardOptions,
}: {
  cards: GameCard[];
  id: ID;
  cardOptions: any;
}) {
  const router = useRouter();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const card = cards.main.data.find((c) => c.id === id);
  const cardMainLang = cards.mainLang.data.find((c) => c.id === id);
  const cardSubLang = cards.subLang.data?.find((c) => c.id === id) || undefined;

  const { firebaseUser, setUserDataKey } = useFirebaseUser();

  const statsIR = sumStats(card.stats?.ir);
  const statsIR4 = sumStats(card.stats?.ir4);

  const collection = firebaseUser.firestore?.collection || [];
  const thisColItem = collection?.find((c) => c.id === id);
  const [collectionOpened, setCollectionOpened] = useState(false);

  // if (thisColItem?.count === 0) setCollectionOpened(false);
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
          // grow
          sx={{
            "&:hover .mantine-Image-imageWrapper": { opacity: 0.25 },
          }}
          spacing={3}
        >
          {["normal", "evolution"].map((type) => (
            <Picture
              key={type}
              // styles={{
              //   figure: {
              //     width: "100%",
              //     height: "100%",
              //     "&:hover > figcaption > div": {
              //       left: -12.5 - 30,
              //     },
              //     "&&&:hover > div": { opacity: 0.9 },
              //   },
              //   imageWrapper: {
              //     height: "100%",
              //     width: "100%",
              //     transition: theme.other.transition,
              //   },
              //   image: {
              //     objectFit: "cover",
              //     objectPosition: "center center",
              //   },
              // }}
              // // width={100}
              // // height={100}
              sx={{
                position: "relative",
                height: 100,
                flexBasis: 0,
                flexShrink: 1,
                flexGrow: 1,
                maxWidth: "100%",
                "&:hover": { flexGrow: card.rarity >= 4 ? 2.5 : 1.1 },
                transition: theme.other.transition,
                img: {
                  width: "100%",
                },
              }}
              srcB2={
                card.rarity >= 4
                  ? `assets/card_still_full1_${card.id}_${type}.png` // 4-5 -> full cg
                  : `assets/card_rectangle4_${card.id}_${type}.png` // 1-3 -> frameless
              }
              alt={card.title}
              radius={3}
              // // height="100%"
              // withPlaceholder
              // placeholder={
              //   <>
              //     <Skeleton width="100%" height="100%" />
              //   </>
              // }
              // caption={type === "normal" && <RarityBadge card={card} />}
            />
          ))}
        </Group>
      </Card.Section>
      <Card.Section px="sm" pt="xs">
        <Text size="sm" weight="700">
          {`${cardMainLang?.title}`}&nbsp;
          <OfficialityBadge langData={cards.mainLang} />
        </Text>
        {cardSubLang && (
          <Text size="xs" color="dimmed" weight="500">
            {`${cardSubLang.title}`}&nbsp;
            <OfficialityBadge langData={cards.subLang} />
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
          {firebaseUser.loggedIn && (
            <Group>
              <Box
                // ml="xs"
                sx={(theme) => ({
                  marginLeft: theme.spacing.xs / 2,
                })}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!thisColItem) {
                    const newCollection = addCard(collection, card.id, 1);
                    setUserDataKey({ collection: newCollection });
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
                  position="right-center"
                  withinPortal
                >
                  <Popover.Target>
                    <ActionIcon
                      variant="light"
                      {...(thisColItem?.count > 0 ? { color: "orange" } : {})}
                      // color="red"
                    >
                      {thisColItem?.count > 0 ? (
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
                        onClick={(e) => {
                          e.stopPropagation();

                          const newCollection = addCard(collection, card.id, 1);
                          setUserDataKey({ collection: newCollection });
                        }}
                        disabled={thisColItem?.count >= 5}
                      >
                        <IconPlus size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();

                          const newCollection = addCard(
                            collection,
                            card.id,
                            -1
                          );
                          setUserDataKey({ collection: newCollection });
                        }}
                        disabled={thisColItem?.count <= 0}
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
            // mt={3}
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
