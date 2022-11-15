import {
  Box,
  Button,
  Input,
  Modal,
  Paper,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";
import { MeiliSearch } from "meilisearch";
import Link from "next/link";

const client = new MeiliSearch({
  host: "https://puka.ensemble.moe",
  headers: {
    Authorization: `Bearer ${process.env.MEILISEARCH_API_KEY}`,
    "Content-Type": "application/json",
  },
});

const charactersIndex = client.index("characters");
const cardsIndex = client.index("cards");
const eventsIndex = client.index("events");

function SearchCard({
  type,
  id,
  content,
  onClick,
}: {
  type: string;
  id: number;
  content: string;
  onClick: any;
}) {
  return (
    <Box
      component={Link}
      href={`/${type}s/${id}`}
      sx={{
        display: "block",
        color: "inherit",
        textDecoration: "none",
        padding: "5px 0px",
      }}
      onClick={onClick}
    >
      <Text size="lg">
        {content}{" "}
        <Text color="dimmed" component="span">
          ({type.charAt(0).toUpperCase() + type.slice(1)})
        </Text>
      </Text>
    </Box>
  );
}

function Searchbar() {
  const [opened, setOpened] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  async function searchIndexes(value: string) {
    const charactersSearch = await charactersIndex.search(value, { limit: 5 });
    const cardsSearch = await cardsIndex.search(value, { limit: 5 });
    const eventsSearch = await eventsIndex.search(value, { limit: 5 });
    console.log(eventsSearch.hits);
    value.length > 0
      ? setSearchResults([
          ...charactersSearch.hits,
          ...cardsSearch.hits,
          ...eventsSearch.hits,
        ])
      : setSearchResults([]);
    console.log(charactersSearch);
  }

  useEffect(() => {
    searchIndexes(searchValue);
    if (searchValue === "") setSearchResults([]);
  }, [searchValue]);

  return (
    <>
      <Modal
        title={<Title order={3}>Search</Title>}
        opened={opened}
        onClose={() => setOpened(false)}
        size="xl"
      >
        <Input
          icon={<IconSearch />}
          placeholder="Search"
          onChange={(event: any) => setSearchValue(event.target.value)}
        />
        <Space h="xl" />
        <Paper sx={{ padding: "0px 5px" }} withBorder>
          {searchResults.length > 0
            ? searchResults.map((result) => {
                if (result.character_id) {
                  return (
                    <SearchCard
                      key={result.character_id}
                      type="character"
                      id={result.character_id}
                      content={`${result.en__first_name} ${result.en__last_name}`}
                      onClick={() => {
                        setOpened(false);
                        setSearchResults([]);
                      }}
                    />
                  );
                } else if (result.id) {
                  return (
                    <SearchCard
                      key={result.id}
                      type="card"
                      id={result.id}
                      content={result.en__title}
                      onClick={() => {
                        setOpened(false);
                        setSearchResults([]);
                      }}
                    />
                  );
                } else if (result.event_id) {
                  return (
                    <SearchCard
                      key={result.event_id}
                      type="event"
                      id={result.event_id}
                      content={result.en__name}
                      onClick={() => {
                        setOpened(false);
                        setSearchResults([]);
                      }}
                    />
                  );
                }
              })
            : "No search results found"}
        </Paper>
      </Modal>

      <Button
        variant="subtle"
        color="indigo"
        onClick={() => setOpened(true)}
        leftIcon={<IconSearch />}
      >
        Search
      </Button>
    </>
  );
}

export default Searchbar;
