import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Center,
  Chip,
  Group,
  Input,
  Loader,
  MultiSelect,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Tooltip,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowsSort,
  IconCards,
  IconLayoutGrid,
  IconLayoutList,
  IconList,
  IconPhoto,
  IconSortAscending,
  IconSortDescending,
  IconStar,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useListState, useLocalStorage } from "@mantine/hooks";
import useTranslation from "next-translate/useTranslation";
import InfiniteScroll from "react-infinite-scroll-component";
import { IconGhost } from "@tabler/icons-react";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getAssetURL, getLocalizedDataArray } from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import {
  GameCard,
  GameCharacter,
  GameUnit,
  GameRegion,
  GameCardOld,
  CardRarity,
  ID,
} from "types/game";
import { QuerySuccess } from "types/makotools";
import useFSSList from "services/makotools/search";
import useUser from "services/firebase/user";
import SearchOptions from "components/core/SearchOptions";
import firstEraCardsJSON from "data/firstEraCards.json";
import Picture from "components/core/Picture";
import { downloadFromURL } from "services/utilities";

const firstEraCards = firstEraCardsJSON as GameCardOld[];

const defaultView = {
  filters: {
    characters: [] as number[],
    eras: [] as string[],
    rarity: ["5"] as string[],
  },
  search: "",
  sort: {
    type: "id",
    ascending: true,
  },
};

const ASSET_LIST_INITIAL_COUNT = 40;

interface AssetCard {
  era: string;
  id: number;
  character_id: number;
  rarity: CardRarity;
  name: { en: string; jp: string };
}

const assetTypes = [
  {
    id: "frameless",
    url: {
      first: (id: ID, type: string) => `assets_1/cs_${id}_${type}.png`,
      second: (id: ID, type: string) =>
        `assets/card_rectangle4_${id}_${type}.png`,
    },
    icon: IconCards,
  },
  {
    id: "cg",
    url: {
      first: (id: ID, type: string) => `assets_1/still_${id}_${type}.png`,
      second: (id: ID, type: string) =>
        `assets/card_still_full1_${id}_${type}.png`,
    },
    icon: IconPhoto,
  },
  {
    id: "render",
    url: {
      first: (id: ID, type: string) => `assets_1/cf_${id}_${type}.png`,
      second: (id: ID, type: string) => `assets/card_full1_${id}_${type}.png`,
    },
    icon: IconGhost,
  },
];

function CompactAssetCard({
  card,
  assetType,
}: {
  card: AssetCard;
  assetType: (typeof assetTypes)[0];
}) {
  const { t } = useTranslation("assets");
  const theme = useMantineTheme();
  return (
    <Card withBorder p={0} key={`${card.id}${assetType.id}${card.era}`}>
      <Card.Section sx={{ position: "relative" }} p={3}>
        <Group spacing={3} align="stretch" noWrap>
          {["normal", "evolution"].map((type) => (
            <Picture
              key={type}
              sx={{
                minWidth: 84,
                minHeight: 120,
                flexShrink: 0,
                flexBasis: 60,
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
              }}
              srcB2={
                card.era === "!!"
                  ? assetTypes[0].url.second(card.id, type)
                  : assetTypes[0].url.first(card.id, type)
                // card.era === "!"
                //   ? `assets_1/cs_${card.id}_${type}.png` // 4-5 -> full cg
                //   : `assets/card_rectangle4_${card.id}_${type}.png` // 1-3 -> frameless
              }
              alt={card.name?.en || card.name?.jp || ""}
              radius={3}
              transparent={assetType.id === "render"}
            >
              <Group
                spacing={3}
                position="right"
                key={type}
                sx={{ position: "absolute", right: 4, bottom: 4 }}
              >
                {assetTypes.map((ty) => (
                  <Tooltip
                    key={ty.id}
                    label={t(`downloadTypeTooltip`, {
                      type: t(`search.assetType.${ty.id}`),
                    })}
                    withinPortal
                  >
                    <ActionIcon
                      size="sm"
                      component="a"
                      sx={{
                        background: theme.colors.dark[9] + "77",
                        color: theme.white,
                        ":hover": {
                          background: theme.colors.dark[9] + "BB",
                        },
                        backdropFilter: "blur(5px)",
                      }}
                      onClick={() => {
                        downloadFromURL(
                          getAssetURL(
                            card.era === "!!"
                              ? ty.url.second(card.id, type)
                              : ty.url.first(card.id, type)
                          )
                        );
                      }}
                    >
                      <ty.icon size={16} />
                    </ActionIcon>
                  </Tooltip>
                ))}
              </Group>
            </Picture>
          ))}
        </Group>
      </Card.Section>
    </Card>
  );
}

function ListAssetCard({
  card,
  assetType,
}: {
  card: AssetCard;
  assetType: (typeof assetTypes)[0];
}) {
  const { t } = useTranslation("assets");
  const theme = useMantineTheme();
  return (
    <>
      {["normal", "evolution"].map((type) => (
        <Card
          withBorder
          p={0}
          key={`${card.id}${assetType.id}${card.era}${type}`}
        >
          <Card.Section sx={{ position: "relative" }} p={3}>
            <Group spacing={3} align="stretch" noWrap>
              <Picture
                key={type}
                sx={{
                  minWidth: 60,
                  minHeight: 60,
                  flexShrink: 0,
                  flexBasis: 60,
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
                }}
                srcB2={
                  card.era === "!!"
                    ? assetTypes[0].url.second(card.id, type)
                    : assetTypes[0].url.first(card.id, type)
                  // card.era === "!"
                  //   ? `assets_1/cs_${card.id}_${type}.png` // 4-5 -> full cg
                  //   : `assets/card_rectangle4_${card.id}_${type}.png` // 1-3 -> frameless
                }
                alt={card.name?.en || card.name?.jp || ""}
                radius={3}
                transparent={assetType.id === "render"}
              />
              <Group
                spacing={8}
                sx={{
                  "&&&": {
                    flexGrow: 1,
                    minWidth: 0,
                  },
                }}
                py="xs"
                pl="sm"
                pr="xs"
                align="center"
              >
                <Stack
                  spacing={0}
                  sx={{
                    "&&&": {
                      flexGrow: 1,
                      flexBasis: 150,
                      flexShrink: 1,
                      minWidth: 0,
                    },
                    "& div": {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                >
                  <Text size="sm" weight="700">
                    {`${card.name.en ?? card.name.jp}`}
                  </Text>
                  <Text size="xs" color="dimmed" weight="500">
                    <Badge
                      size="sm"
                      variant="light"
                      color={theme.primaryColor}
                      sx={{ verticalAlign: 1 }}
                      mr={6}
                    >
                      <Text
                        inherit
                        weight="700"
                        sx={{
                          fontFeatureSettings: "'kern' 1, 'ss02' 1",
                        }}
                      >
                        {card.rarity}
                        <IconStar
                          size={8}
                          strokeWidth={3}
                          style={{ verticalAlign: 0 }}
                        />
                      </Text>
                    </Badge>
                    {card.name.en && <>{`${card.name.jp}`}</>}
                  </Text>
                </Stack>
                <Group spacing={4} position="right">
                  {assetTypes.map((ty) => (
                    <Tooltip
                      key={ty.id}
                      label={t(`downloadTypeTooltip`, {
                        type: t(`search.assetType.${ty.id}`),
                      })}
                      withinPortal
                    >
                      <ActionIcon
                        onClick={() => {
                          console.log(
                            getAssetURL(
                              card.era === "!!"
                                ? ty.url.second(card.id, type)
                                : ty.url.first(card.id, type)
                            )
                          );
                          downloadFromURL(
                            getAssetURL(
                              card.era === "!!"
                                ? ty.url.second(card.id, type)
                                : ty.url.first(card.id, type)
                            )
                          );
                        }}
                        variant="default"
                      >
                        <ty.icon size={16} />
                      </ActionIcon>
                    </Tooltip>
                  ))}
                </Group>
              </Group>
            </Group>
          </Card.Section>
        </Card>
      ))}
    </>
  );
}

function FullAssetCard({
  card,
  assetType,
}: {
  card: AssetCard;
  assetType: (typeof assetTypes)[0];
}) {
  const theme = useMantineTheme();
  return (
    <Card withBorder p={0} key={`full${card.id}${assetType.id}`}>
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
                  flexGrow: 1.1,
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
                card.era === "!!"
                  ? assetType.url.second(card.id, type)
                  : assetType.url.first(card.id, type)
                // card.era === "!"
                //   ? `assets_1/cs_${card.id}_${type}.png` // 4-5 -> full cg
                //   : `assets/card_rectangle4_${card.id}_${type}.png` // 1-3 -> frameless
              }
              alt={card.name?.en || card.name?.jp || ""}
              radius={3}
              action="download"
              transparent={assetType.id === "render"}
            >
              {type === "normal" && (
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
                    color={theme.primaryColor}
                  >
                    {card.rarity}
                    <IconStar
                      size={10}
                      strokeWidth={3}
                      style={{ verticalAlign: -1 }}
                    />
                  </Text>
                </Paper>
              )}
            </Picture>
          ))}
        </Group>
      </Card.Section>
      <Card.Section px="sm" py="xs">
        <Text size="sm" weight="700">
          {`${card.name.en ?? card.name.jp}`}
        </Text>
        {card.name.en && (
          <Text size="xs" color="dimmed" weight="500">
            {`${card.name.jp}`}
          </Text>
        )}
      </Card.Section>
    </Card>
  );
}

// rewrite infinite scroll styles to use createStyles

const useStyles = createStyles((theme, _params, getRef) => ({
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "[s] repeat(auto-fill, minmax(180px, 1fr)) [e]",
    gap: theme.spacing.xs,
    alignItems: "flex-start",
  },
  cardGridList: {
    display: "grid",
    gridTemplateColumns: "[s] 1fr[e]",
    gap: theme.spacing.xs,
    alignItems: "flex-start",
    [theme.fn.largerThan("md")]: {
      gridTemplateColumns: "[s] repeat(2, 1fr) [e]",
    },
  },
}));

function Page({
  cardsQuery,
  unitsQuery,
  charactersQuery,
  allCardsList,
}: {
  cardsQuery: QuerySuccess<GameCard[]>;
  unitsQuery: QuerySuccess<GameUnit[]>;
  charactersQuery: QuerySuccess<GameCharacter[]>;
  allCardsList: AssetCard[];
}) {
  const { classes } = useStyles();
  const { t } = useTranslation("assets");
  const user = useUser();
  const theme = useMantineTheme();
  const characters = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const [count, setCount] = useState<number>(ASSET_LIST_INITIAL_COUNT);
  const [slicedAssetsList, setSlicedAssetsList] = useState<AssetCard[]>([]);

  let characterIDtoSort: { [key: number]: number } = {};
  characters.forEach((c) => {
    characterIDtoSort[c.character_id] = c.sort_id;
  });

  const fssOptions = useMemo<FSSOptions<AssetCard, typeof defaultView.filters>>(
    () => ({
      filters: [
        {
          type: "characters",
          values: [],
          function: (view) => {
            return (c) => view.filters.characters.includes(c.character_id);
          },
        },
        {
          type: "eras",
          values: [],
          function: (view) => {
            return (c) => view.filters.eras.includes(c.era);
          },
        },
        {
          type: "rarity",
          values: [],
          function: (view) => {
            return (c) => view.filters.rarity.includes(c.rarity.toString());
          },
        },
      ],
      sorts: [
        {
          label: t("search.id"),
          value: "id",
          function: (a, b) => a.id - b.id,
        },
        {
          label: t("search.charLabel"),
          value: "character",
          function: (a, b) =>
            characterIDtoSort[a.character_id] -
            characterIDtoSort[b.character_id],
        },
      ],
      baseSort: "id",
      search: {
        fields: ["name.en", "name.jp"],
      },
      defaultView,
    }),
    [t]
  );
  const { results, view, setView } = useFSSList<
    AssetCard,
    typeof defaultView.filters
  >(allCardsList, fssOptions);

  const [viewOptions, setViewOptions] = useLocalStorage({
    key: "viewOptions__event",
    defaultValue: {
      region:
        (user.loggedIn && user.db?.setting__game_region) ||
        ("en" as GameRegion),
      density: "full" as "full" | "list" | "compact",
      assetType: "frameless",
    },
  });

  const [bookmarks, handlers] = useListState<number>(
    user.loggedIn ? user.db.bookmarks__events || [] : []
  );

  useEffect(() => {
    setSlicedAssetsList(results.slice(0, count));
  }, [results, count]);

  const loadMore = () => {
    const newCount = count + ASSET_LIST_INITIAL_COUNT;
    setCount(newCount);
  };

  const assetType = useMemo(
    () =>
      assetTypes.find((t) => t.id === viewOptions.assetType) || assetTypes[0],
    [viewOptions.assetType]
  );

  return (
    <>
      <PageTitle title={t("title")} />
      <SearchOptions
        searchProps={{
          placeholder: t("search.searchPlaceholder"),
          value: view.search,
          onChange: (event) => {
            setView((v) => ({
              ...v,
              search: event.target.value,
            }));
          },
          width: "100%",
        }}
        filters={
          <Group>
            <Select
              label={t("common:search.sortLabel")}
              placeholder={t("common:search.sortPlaceholder")}
              // data={fssOptions.sorts}
              // value={view.sort.type}
              onChange={(value) => {
                if (value)
                  setView((v) => ({
                    ...v,
                    sort: {
                      ...v.sort,
                      type: value,
                    },
                  }));
              }}
              sx={{ maxWidth: 200 }}
              variant="default"
              icon={<IconArrowsSort size="1em" />}
              {...(view.search
                ? {
                    disabled: true,
                    data: [
                      {
                        label: t("common:search.relevance"),
                        value: "relevance",
                      },
                    ],
                    value: "relevance",
                    rightSection: undefined,
                  }
                : {
                    disabled: false,
                    data: fssOptions.sorts,
                    value: view.sort.type,
                    rightSection: (
                      <Tooltip label="Toggle ascending/descending">
                        <ActionIcon
                          onClick={() => {
                            setView((v) => ({
                              ...v,
                              sort: {
                                ...v.sort,
                                ascending: !v.sort.ascending,
                              },
                            }));
                          }}
                          variant="light"
                          color={theme.primaryColor}
                        >
                          {view.sort.ascending ? (
                            <IconSortAscending size={16} />
                          ) : (
                            <IconSortDescending size={16} />
                          )}
                        </ActionIcon>
                      </Tooltip>
                    ),
                  })}
            />
            <MultiSelect
              label={t("search.charLabel")}
              placeholder={t("search.charPlaceholder")}
              data={characters
                .sort((a, b) => a.sort_id - b.sort_id)
                .map((c: GameCharacter) => {
                  return {
                    value: c.character_id.toString(),
                    label: c.first_name[0],
                  };
                })}
              value={view.filters.characters.map((u) => u.toString())}
              onChange={(val) => {
                setView((v) => ({
                  ...v,
                  filters: {
                    ...v.filters,
                    characters: val.map((u) => parseInt(u)),
                  },
                }));
              }}
              sx={{ maxWidth: 400 }}
              variant="default"
              searchable
            />
            <Input.Wrapper id="type" label="Rarity">
              <Chip.Group
                multiple
                value={view.filters.rarity}
                onChange={(val) => {
                  setView((v) => ({
                    ...v,
                    filters: {
                      ...v.filters,
                      rarity: val,
                    },
                  }));
                }}
                spacing={3}
              >
                {[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                  { value: "5", label: "5" },
                ].map((r) => (
                  <Chip
                    key={r.value}
                    value={r.value}
                    radius="md"
                    styles={{
                      label: { paddingLeft: 10, paddingRight: 10 },
                    }}
                    variant="filled"
                  >
                    {r.label}
                  </Chip>
                ))}
              </Chip.Group>
            </Input.Wrapper>
            <Input.Wrapper id="type" label="Eras">
              <Chip.Group
                multiple
                value={view.filters.eras}
                onChange={(val) => {
                  setView((v) => ({
                    ...v,
                    filters: {
                      ...v.filters,
                      eras: val,
                    },
                  }));
                }}
                spacing={3}
              >
                {[
                  { value: "!", label: "!" },
                  { value: "!!", label: "!!" },
                ].map((r) => (
                  <Chip
                    key={r.value}
                    value={r.value}
                    radius="md"
                    styles={{
                      label: { paddingLeft: 10, paddingRight: 10 },
                    }}
                    variant="filled"
                  >
                    {r.label}
                  </Chip>
                ))}
              </Chip.Group>
            </Input.Wrapper>
          </Group>
        }
        resetFilters={() => {
          setView(defaultView);
        }}
        display={
          <Group align="flex-start">
            <Input.Wrapper label={t("common:search.density")}>
              <SegmentedControl
                sx={{ display: "flex" }}
                value={viewOptions.density}
                onChange={(value) => {
                  setViewOptions((v) => ({
                    ...v,
                    density: value as "full" | "compact" | "list",
                  }));
                }}
                data={[
                  {
                    value: "full",
                    label: (
                      <Center>
                        <IconLayoutList size={16} />
                        <Box ml={10}>{t("common:search.full")}</Box>
                      </Center>
                    ),
                  },
                  {
                    value: "list",
                    label: (
                      <Center>
                        <IconList size={16} />
                        <Box ml={10}>{t("common:search.list")}</Box>
                      </Center>
                    ),
                  },
                  {
                    value: "compact",
                    label: (
                      <Center>
                        <IconLayoutGrid size={16} />
                        <Box ml={10}>{t("common:search.compact")}</Box>
                      </Center>
                    ),
                  },
                ]}
              />
            </Input.Wrapper>
            <Input.Wrapper label={t("search.assetTypeLabel")}>
              <SegmentedControl
                sx={{ display: "flex" }}
                value={
                  viewOptions.density !== "full"
                    ? "frameless"
                    : viewOptions.assetType
                }
                onChange={(value) => {
                  setViewOptions((v) => ({ ...v, assetType: value }));
                }}
                data={assetTypes.map((ty) => ({
                  value: ty.id,
                  label: (
                    <Center>
                      <ty.icon size={16} />
                      <Box ml={10}>{t(`search.assetType.${ty.id}`)}</Box>
                    </Center>
                  ),
                }))}
                disabled={viewOptions.density !== "full"}
              />
            </Input.Wrapper>
          </Group>
        }
      />

      {slicedAssetsList.length ? (
        <>
          <Text color="dimmed" mt="xl" mb="sm" size="sm">
            {t("common:search.resultsFound", { count: results.length })}
          </Text>
          <InfiniteScroll
            dataLength={slicedAssetsList.length}
            next={loadMore}
            hasMore={count < results.length}
            loader={
              <Center sx={{ gridColumn: "s/e" }} my="lg">
                <Loader variant="bars" />
              </Center>
            }
            className={
              viewOptions.density === "list"
                ? classes.cardGridList
                : classes.cardGrid
            }
          >
            {slicedAssetsList.map((card, i) =>
              viewOptions.density === "compact" ? (
                <CompactAssetCard
                  key={card.id}
                  card={card}
                  assetType={assetType}
                />
              ) : viewOptions.density === "list" ? (
                <ListAssetCard
                  key={card.id}
                  card={card}
                  assetType={assetType}
                />
              ) : (
                <FullAssetCard
                  key={card.id}
                  card={card}
                  assetType={assetType}
                />
              )
            )}
          </InfiniteScroll>
        </>
      ) : (
        <Text align="center" color="dimmed" mt="xl" mb="sm" size="sm">
          No cards found.
        </Text>
      )}
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const cardsQuery: any = await getLocalizedDataArray<GameCard>(
    "cards",
    "en",
    "id",
    ["id", "character_id", "rarity", "title"]
  );

  const charactersQuery: any = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id",
    ["character_id", "first_name", "sort_id"]
  );

  const unitsQuery: any = await getLocalizedDataArray<GameUnit>(
    "units",
    locale,
    "id"
  );

  // const events: Event[] = retrieveEvents(
  //   {
  //     gameEvents: getEvents.data,
  //   },
  //   locale
  // ) as Event[];

  const allCardsList: AssetCard[] = [
    ...(cardsQuery.data as GameCard[]).map((c) => ({
      era: "!!",
      id: c.id,
      character_id: c.character_id,
      rarity: c.rarity,
      name: {
        en: c.title[0],
        jp: c.title[1],
      },
    })),
    ...firstEraCards.map((c) => ({
      era: "!",
      id: c.id,
      character_id: c.character_id,
      rarity: c.rarity,
      name: c.name,
    })),
  ];

  return {
    props: {
      cardsQuery,
      unitsQuery,
      charactersQuery,
      allCardsList,
    },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
