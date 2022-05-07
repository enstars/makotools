import { useState, useEffect } from "react";
import TitleApp from "../../components/Title";
import { getLocalizedData } from "../../services/ensquare";
import { Table, Box, Text, useMantineTheme } from "@mantine/core";
import InfiniteScroll from "react-infinite-scroll-component";
import CardCard from "../../components/cards/CardCard";

function Page({ characters, unit_to_characters, units, cards }) {
  const theme = useMantineTheme();
  const [count, setCount] = useState(20);
  const [cardsList, setCardsList] = useState([]);
  console.log(cards);

  useEffect(() => {
    setCardsList(cards[0].slice(0, count));
  }, [count]);

  const loadMore = () => {
    setCount(count + 20);
  };

  return (
    <div className="content-text">
      <TitleApp title="Cards" />
      <InfiniteScroll
        dataLength={cardsList.length} //This is important field to render the next data
        next={loadMore}
        hasMore={count < cards[0].length}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(176px, 1fr))",
          gap: theme.spacing.xs,
        }}
      >
        {cardsList.map((e, i) => (
          <CardCard key={e.id} cards={cards} i={i} />
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
  console.log(locale);
  const characters = await getLocalizedData("characters");
  const unit_to_characters = await getLocalizedData("unit_to_characters");
  const units = await getLocalizedData("units");
  const cards = await getLocalizedData("cards");

  return {
    props: { characters, unit_to_characters, units, cards },
  };
}

import Layout from "../../components/Layout";
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
