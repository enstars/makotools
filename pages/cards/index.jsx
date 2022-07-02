import { useState, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { getLocalizedData } from "../../services/ensquare";
import {
  Table,
  Box,
  Text,
  Paper,
  Group,
  Select,
  useMantineTheme,
} from "@mantine/core";
import InfiniteScroll from "react-infinite-scroll-component";
import CardCard from "../../components/cards/CardCard";

function Page({ cards, characters }) {
  const theme = useMantineTheme();
  const [count, setCount] = useState(20);
  const [cardsList, setCardsList] = useState([]);
  // console.log(cards);

  useEffect(() => {
    setCardsList(
      cards.main.data
        .filter((c) => {
          console.log(c);
          return c.rarity === 5 && c.id <= 9999;
        })
        .slice(0, count)
    );
  }, [count]);

  const loadMore = () => {
    setCount(count + 20);
  };

  return (
    <div className="content-text">
      <PageTitle title="Cards" />
      {/* <Paper mb="sm" p="md" withBorder>
        <Text weight="700" size="xs" color="dimmed">
          Search Options
        </Text>
        <Group>
          <Select
            label="Unit"
            placeholder="Pick a unit..."
            data={filterOptions.map((o) => {
              return {
                value: o,
                label: o.unit_name,
              };
            })}
            onChange={handleNewUnit}
            searchable
            clearable
            allowDeselect
            // sx={{ maxWidth: 200 }}
            size="sm"
            variant="default"
          />
        </Group>
      </Paper> */}
      <Text color="dimmed" mb="sm" size="sm">
        Only 5-star cards are shown on this page at the moment!
      </Text>
      <InfiniteScroll
        dataLength={cardsList.length} //This is important field to render the next data
        next={loadMore}
        hasMore={count < cards.main.data.length}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>You reached the end!</b>
          </p>
        }
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(224px, 1fr))",
          gap: theme.spacing.xs,
        }}
      >
        {cardsList.map((e, i) => (
          <CardCard
            key={e.id}
            cards={cards}
            i={i}
            id={e.id}
            characters={characters.main.data}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default Page;

export async function getServerSideProps({ res, locale, ...context }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=7200, stale-while-revalidate=172800"
  );
  // refresh every 2 hours, stale for 48hrs
  // console.log(locale);
  const characters = await getLocalizedData("characters", locale);
  // const unit_to_characters = await getLocalizedData("unit_to_characters");
  // const units = await getLocalizedData("units");
  const cards = await getLocalizedData("cards");

  return {
    props: { characters, cards },
  };
}

import Layout from "../../components/Layout";
Page.getLayout = function getLayout(page) {
  return <Layout wide>{page}</Layout>;
};
