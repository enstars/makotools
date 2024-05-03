import { useState, useEffect, useMemo } from "react";
import {
  useMantineTheme,
  Text,
  Center,
  Loader,
  Group,
  Select,
  MultiSelect,
  Input,
  Chip,
} from "@mantine/core";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDebouncedValue, useLocalStorage } from "@mantine/hooks";
import fuzzysort from "fuzzysort";
import useTranslation from "next-translate/useTranslation";
import { IconArrowsSort } from "@tabler/icons-react";

import NewCollectionModal from "./components/NewCollectionModal";

import { CardCard } from "components/core/CardCard";
import PageTitle from "components/sections/PageTitle";
import { getLayout } from "components/Layout";
import { QuerySuccess } from "types/makotools";
import getServerSideUser from "services/firebase/getServerSideUser";
import { getLocalizedDataArray } from "services/data";
import { CardRarity, GameCard, GameCharacter } from "types/game";
import { useCollections } from "services/makotools/collection";
import SearchOptions from "components/core/SearchOptions";
import useFSSList from "services/makotools/search";

type SortOption = "id" | "character";

interface CardViewOptions {
  filterRarity: CardRarity[];
  filterCharacters: string[];
  sortOption: SortOption;
  searchQuery: string;
  sortDescending: boolean;
}

const CARD_LIST_INITIAL_COUNT = 20;
const CARD_VIEW_OPTIONS_DEFAULT: CardViewOptions = {
  filterRarity: [5],
  filterCharacters: [],
  sortOption: "id",
  searchQuery: "",
  sortDescending: false,
};

const defaultView = {
  filters: {
    rarity: [5],
    characters: [] as number[],
  },
  search: "",
  sort: {
    type: "id",
    ascending: true,
  },
};

function Page({
  charactersQuery,
  cardsQuery,
}: {
  charactersQuery: QuerySuccess<GameCharacter[]>;
  cardsQuery: QuerySuccess<GameCard[]>;
}) {
  const cards = useMemo(() => cardsQuery.data, [cardsQuery.data]);
  const characters = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const { t } = useTranslation("cards");
  const theme = useMantineTheme();
  const [count, setCount] = useState<number>(CARD_LIST_INITIAL_COUNT);
  const [cardsList, setCardsList] = useState<GameCard[]>([]);
  const [slicedCardsList, setSlicedCardsList] = useState<GameCard[]>([]);
  const [viewOptions, setViewOptions] = useLocalStorage<CardViewOptions>({
    key: "cardFilters",
    defaultValue: CARD_VIEW_OPTIONS_DEFAULT,
  });
  const [cardOptions, setCardOptions] = useLocalStorage({
    key: "cardOptions",
    defaultValue: {
      showFullInfo: false,
    },
  });
  const [search, setSearch] = useState("");
  const [newCollectionModalOpened, setNewCollectionModalOpened] =
    useState<boolean>(false);
  const [debouncedSearch] = useDebouncedValue(search, 200);
  const { collections, onEditCollection, onNewCollection } = useCollections();

  let characterIDtoSort: { [key: number]: number } = {};
  characters.forEach((c) => {
    characterIDtoSort[c.character_id] = c.sort_id;
  });

  const descendingNum = viewOptions.sortDescending ? -1 : 1;
  const SORT_FUNCTIONS = {
    id: (a: any, b: any) => (a.id - b.id) * descendingNum,
    character: (a: any, b: any) =>
      (characterIDtoSort[a.character_id] - characterIDtoSort[b.character_id]) *
      descendingNum,
  };

  useEffect(() => {
    let filteredList: GameCard[] = cards
      .filter((c) => {
        return c.id <= 9999;
      })
      .filter((c) => {
        return viewOptions.filterRarity.includes(c.rarity);
      })
      .filter((c) => {
        if (viewOptions.filterCharacters.length)
          return viewOptions.filterCharacters.includes(
            c.character_id.toString()
          );
        return true;
      });

    const searchedList = fuzzysort.go(debouncedSearch, filteredList, {
      keys: ["title.0", "title.1", "title.2"],
      all: true,
    });
    const sortedList = [...searchedList]
      .sort((a: any, b: any) => b.score - a.score)
      .map((cr) => cr.obj)
      .sort(SORT_FUNCTIONS["id"])
      .sort(SORT_FUNCTIONS[viewOptions.sortOption]);
    setCardsList(sortedList);
    setCount(CARD_LIST_INITIAL_COUNT);
  }, [viewOptions, debouncedSearch]);

  useEffect(() => {
    setSlicedCardsList(cardsList.slice(0, count));
  }, [cardsList, count]);

  const loadMore = () => {
    const newCount = count + CARD_LIST_INITIAL_COUNT;
    setCount(newCount);
  };

  const fssOptions = useMemo<FSSOptions<GameCard, typeof defaultView.filters>>(
    () => ({
      filters: [
        {
          type: "rarity",
          values: [],
          function: (view) => {
            return (c: GameCard) => view.filters.rarity.includes(c.rarity);
          },
        },
        {
          type: "characters",
          values: [],
          function: (view) => {
            return (c: GameCard) =>
              view.filters.characters.includes(c.character_id);
          },
        },
      ],
      sorts: [
        {
          label: t("search.cardId"),
          value: "id",
          function: (a: GameCard, b: GameCard) => a.id - b.id,
        },
        {
          label: t("search.character"),
          value: "character",
          function: (a: GameCard, b: GameCard) =>
            characterIDtoSort[a.character_id] -
            characterIDtoSort[b.character_id],
        },
      ],
      baseSort: "id",
      search: {
        fields: ["title.0", "title.1", "title.2"],
      },
      defaultView,
    }),
    []
  );

  const { results, view, setView } = useFSSList<
    GameCard,
    typeof defaultView.filters
  >(cards, fssOptions);

  return (
    <>
      <PageTitle title={t("title")} />

      {/* <Paper mb="sm" p="md" withBorder>
        <Text weight="700" size="xs" color="dimmed">
          <IconSearch size="1em" /> {t("common:search.searchOptions")}
        </Text>
        <Group sx={{ alignItems: "flex-start" }}>
          <TextInput
            label={t("common:search.searchLabel")}
            placeholder={t("search.searchPlaceholder")}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            sx={{ maxWidth: 200 }}
            variant="default"
            icon={<IconSearch size="1em" />}
          />
          <Select
            label={t("common:search.sortLabel")}
            placeholder={t("search.sortPlaceholder")}
            data={SORT_OPTIONS}
            value={viewOptions.sortOption}
            onChange={(val: SortOption) => {
              if (val) setViewOptions({ ...viewOptions, sortOption: val });
            }}
            sx={{ maxWidth: 200 }}
            variant="default"
            icon={<IconArrowsSort size="1em" />}
            rightSection={
              <Tooltip label={t("common:search.sortTooltip")}>
                <ActionIcon
                  onClick={() => {
                    setViewOptions((v) => ({
                      ...viewOptions,
                      sortDescending: !v.sortDescending,
                    }));
                  }}
                  variant="light"
                  color={theme.primaryColor}
                >
                  {viewOptions.sortDescending ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Tooltip>
            }
          />
          <MultiSelect
            label={t("search.charLabel")}
            placeholder={t("search.charPlaceholder")}
            data={characters
              .sort(
                (a: any, b: any) =>
                  characterIDtoSort[a.character_id] -
                  characterIDtoSort[b.character_id]
              )
              .map((c) => {
                return {
                  value: c.character_id.toString(),
                  label: c.first_name[0],
                };
              })}
            value={viewOptions.filterCharacters}
            onChange={(val) => {
              setViewOptions({ ...viewOptions, filterCharacters: val });
            }}
            sx={{ width: "100%", maxWidth: 400 }}
            variant="default"
            searchable
          />
          <Input.Wrapper id="rarity" label={t("search.rarityLabel")}>
            <Chip.Group
              multiple
              value={viewOptions.filterRarity.map((v) => v.toString())}
              onChange={(value) => {
                const filterRarity = value.map(
                  (v) => parseInt(v, 10) as CardRarity
                );
                setViewOptions({ ...viewOptions, filterRarity });
              }}
              spacing={3}
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <Chip
                  key={r}
                  value={r.toString()}
                  radius="md"
                  styles={{
                    label: { paddingLeft: 10, paddingRight: 10 },
                    iconWrapper: { display: "none" },
                  }}
                  color="yellow"
                  variant="filled"
                >
                  {r}
                </Chip>
              ))}
            </Chip.Group>
          </Input.Wrapper>
        </Group>
        <Group mt="xs">
          <Switch
            label={t("search.showFullInfo")}
            checked={cardOptions.showFullInfo}
            onChange={(event) =>
              setCardOptions({
                ...cardOptions,
                showFullInfo: event.currentTarget.checked,
              })
            }
          />
          <Button
            compact
            onClick={() => {
              setViewOptions(CARD_VIEW_OPTIONS_DEFAULT);
            }}
          >
            {t("common:search.resetFilters")}
          </Button>
        </Group>
      </Paper> */}
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
          <Group sx={{ alignItems: "flex-start" }}>
            <Select
              label={t("common:search.sortLabel")}
              placeholder={t("search.sortPlaceholder")}
              onChange={(val: SortOption) => {
                if (val) {
                  setView((v) => ({
                    ...v,
                    sort: {
                      ...v.sort,
                      type: val,
                    },
                  }));
                }
              }}
              sx={{ maxWidth: 200 }}
              variant="default"
              icon={<IconArrowsSort size="1em" />}
              {...(view.search
                ? {
                    disabled: true,
                    data: [
                      {
                        label: t("common:search.sortLabel"),
                      },
                    ],
                  }
                : {
                    disabled: false,
                  })}
            />
            <MultiSelect
              label={t("search.charLabel")}
              placeholder={t("search.charPlaceholder")}
              data={characters
                .sort(
                  (a: any, b: any) =>
                    characterIDtoSort[a.character_id] -
                    characterIDtoSort[b.character_id]
                )
                .map((c) => {
                  return {
                    value: c.character_id.toString(),
                    label: c.first_name[0],
                  };
                })}
              value={viewOptions.filterCharacters}
              onChange={(val) => {
                setViewOptions({ ...viewOptions, filterCharacters: val });
              }}
              sx={{ width: "100%", maxWidth: 400 }}
              variant="default"
              searchable
            />
            <Input.Wrapper id="rarity" label={t("search.rarityLabel")}>
              <Chip.Group
                multiple
                value={viewOptions.filterRarity.map((v) => v.toString())}
                onChange={(value) => {
                  const filterRarity = value.map(
                    (v) => parseInt(v, 10) as CardRarity
                  );
                  setViewOptions({ ...viewOptions, filterRarity });
                }}
                spacing={3}
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <Chip
                    key={r}
                    value={r.toString()}
                    radius="md"
                    styles={{
                      label: { paddingLeft: 10, paddingRight: 10 },
                      iconWrapper: { display: "none" },
                    }}
                    color="yellow"
                    variant="filled"
                  >
                    {r}
                  </Chip>
                ))}
              </Chip.Group>
            </Input.Wrapper>
          </Group>
        }
      />
      {slicedCardsList.length ? (
        <>
          <Text color="dimmed" mt="xl" mb="sm" size="sm">
            {t("resultsFound", { count: cardsList.length })}
          </Text>
          <InfiniteScroll
            dataLength={slicedCardsList.length}
            next={loadMore}
            hasMore={count < cardsList.length}
            loader={
              <Center sx={{ gridColumn: "s/e" }} my="lg">
                <Loader variant="bars" />
              </Center>
            }
            style={{
              display: "grid",
              gridTemplateColumns:
                "[s] repeat(auto-fill, minmax(224px, 1fr)) [e]",
              gap: theme.spacing.xs,
              alignItems: "flex-start",
            }}
          >
            {slicedCardsList.map((e, i) => (
              <CardCard
                key={e.id}
                card={e}
                cardOptions={cardOptions}
                collections={collections}
                lang={cardsQuery.lang}
                onEditCollection={onEditCollection}
                onNewCollection={() => setNewCollectionModalOpened(true)}
              />
            ))}
          </InfiniteScroll>
        </>
      ) : (
        <Text align="center" color="dimmed" mt="xl" mb="sm" size="sm">
          No cards found.
        </Text>
      )}
      <NewCollectionModal
        // use key to reset internal form state on close
        key={JSON.stringify(newCollectionModalOpened)}
        opened={newCollectionModalOpened}
        onClose={() => setNewCollectionModalOpened(false)}
        onNewCollection={onNewCollection}
      />
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const characters = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id",
    ["character_id", "first_name", "sort_id"]
  );
  const cards = await getLocalizedDataArray<GameCard>("cards", locale, "id", [
    "id",
    "name",
    "title",
    "type",
    "rarity",
    "stats.ir.da",
    "stats.ir.vo",
    "stats.ir.pf",
    "stats.ir4.da",
    "stats.ir4.vo",
    "stats.ir4.pf",
    "character_id",
  ]);

  if (characters.status === "error" || cards.status === "error")
    return {
      notFound: true,
    };

  return {
    props: { charactersQuery: characters, cardsQuery: cards },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
