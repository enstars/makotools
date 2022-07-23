import { useState, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { getLocalizedData } from "../../services/ensquare";
import {
  useMantineTheme,
  Text,
  Paper,
  Group,
  Select,
  Chips,
  Chip,
  InputWrapper,
  Center,
  Loader,
  Switch,
  MultiSelect,
} from "@mantine/core";
import InfiniteScroll from "react-infinite-scroll-component";
import CardCard from "../../components/cards/CardCard";
import { useLocalStorage } from "@mantine/hooks";

const CARD_LIST_INITIAL_COUNT = 20;

function Page({ cards, characters }) {
  // console.log(characters);

  const theme = useMantineTheme();
  const [count, setCount] = useState(CARD_LIST_INITIAL_COUNT);
  const [cardsList, setCardsList] = useState([]);
  const [slicedCardsList, setSlicedCardsList] = useState([]);
  const [viewOptions, setViewOptions] = useLocalStorage({
    key: "cardFilters",
    defaultValue: {
      filterRarity: [5],
      filterCharacters: [],
      sortOption: "id",
    },
  });
  const [cardOptions, setCardOptions] = useLocalStorage({
    key: "cardOptions",
    defaultValue: {
      showFullInfo: false,
    },
  });

  let characterIDtoSort = {};
  characters.main.data.forEach((c) => {
    characterIDtoSort[c.character_id] = c.sort_id || c.character_id;
  });

  const SORT_OPTIONS = [
    { value: "id", label: "Card ID" },
    {
      value: "character",
      label: "Character",
    },
  ];

  const SORT_FUNCTIONS = {
    id: (a, b) => a.id > b.id,
    character: (a, b) =>
      characterIDtoSort[a.character_id] > characterIDtoSort[b.character_id],
  };

  useEffect(() => {
    const filteredList = cards.main.data
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
      })
      .sort(SORT_FUNCTIONS["id"])
      .sort(SORT_FUNCTIONS[viewOptions.sortOption]);
    setCardsList(filteredList);
    setCount(CARD_LIST_INITIAL_COUNT);
  }, [viewOptions]);

  useEffect(() => {
    setSlicedCardsList(cardsList.slice(0, count));
  }, [cardsList, count]);

  const loadMore = () => {
    const newCount = count + CARD_LIST_INITIAL_COUNT;
    setCount(newCount);
  };

  return (
    <div className="content-text">
      <PageTitle title="Cards" />

      <Paper mb="sm" p="md" withBorder>
        <Text weight="700" size="xs" color="dimmed">
          <IconSearch size="1em" /> Search Options
        </Text>
        <Group sx={{ alignItems: "flex-start" }}>
          <Select
            label="Sort by"
            placeholder="Pick a unit..."
            data={SORT_OPTIONS}
            value={viewOptions.sortOption}
            onChange={(val) => {
              setViewOptions({ ...viewOptions, sortOption: val });
            }}
            sx={{ maxWidth: 200 }}
            variant="default"
            icon={<IconArrowsSort size="1em" />}
          />
          <MultiSelect
            label="Characters"
            placeholder="Pick a character..."
            data={characters.mainLang.data.map((c) => {
              return { value: c.character_id.toString(), label: c.first_name };
            })}
            value={viewOptions.filterCharacters}
            onChange={(val) => {
              setViewOptions({ ...viewOptions, filterCharacters: val });
            }}
            sx={{ width: "100%", maxWidth: 400 }}
            variant="default"
            searchable
          />
          <InputWrapper id="rarity" label="Rarity">
            <Chips
              color="yellow"
              variant="filled"
              multiple
              value={viewOptions.filterRarity}
              onChange={(filterRarity) => {
                setViewOptions({ ...viewOptions, filterRarity });
              }}
              spacing={3}
              radius="md"
              styles={{
                label: { paddingLeft: 10, paddingRight: 10 },
                iconWrapper: { display: "none" },
              }}
            >
              {[4, 5].map((r) => (
                <Chip key={r} value={r}>
                  {r}
                </Chip>
              ))}
            </Chips>
          </InputWrapper>
        </Group>
        <Group mt="xs">
          <Switch
            label="Show full info"
            checked={cardOptions.showFullInfo}
            onChange={(event) =>
              setCardOptions({
                ...cardOptions,
                showFullInfo: event.currentTarget.checked,
              })
            }
          />
        </Group>
      </Paper>
      {slicedCardsList.length ? (
        <>
          <Text color="dimmed" mt="xl" mb="sm" size="sm">
            {cardsList.length} results found.
          </Text>
          <InfiniteScroll
            dataLength={slicedCardsList.length} //This is important field to render the next data
            next={loadMore}
            hasMore={count < cards.main.data.length}
            loader={
              <Center sx={{ gridColumn: "s/e" }} my="lg">
                <Loader variant="bars" />
              </Center>
            }
            // endMessage={
            //   // <p style={{ textAlign: "center" }}>
            //   //   <b>You reached the end!</b>
            //   // </p>
            // }
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
                cards={cards}
                i={i}
                id={e.id}
                characters={characters.main.data}
                cardOptions={cardOptions}
              />

              // <div
              //   key={e.id}
              //   cards={cards}
              //   i={i}
              //   id={e.id}
              //   characters={characters.main.data}
              //   cardOptions={cardOptions}
              // >
              //   {e.id}
              // </div>
            ))}
          </InfiniteScroll>
        </>
      ) : (
        <Text align="center" color="dimmed" mt="xl" mb="sm" size="sm">
          No cards found.
        </Text>
      )}
    </div>
  );
}

export default Page;

export async function getServerSideProps({ res, locale }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=7200, stale-while-revalidate=172800"
  );
  // refresh every 2 hours, stale for 48hrs
  const characters = await getLocalizedData("characters", locale, [
    "character_id",
    "first_name",
  ]);
  // const unit_to_characters = await getLocalizedData("unit_to_characters");
  // const units = await getLocalizedData("units");
  const cards = await getLocalizedData("cards", locale, [
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

  return {
    props: { characters, cards },
  };
}

import Layout from "../../components/Layout";
import { IconArrowsSort, IconSearch } from "@tabler/icons";
Page.getLayout = function getLayout(page) {
  return <Layout wide>{page}</Layout>;
};
