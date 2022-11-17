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
import { useDebouncedValue } from "@mantine/hooks";

import { CONSTANTS } from "services/makotools/constants";

const client = new MeiliSearch({
  host: CONSTANTS.EXTERNAL_URLS.SEARCH,
  headers: {
    Authorization: `Bearer ${CONSTANTS.KEYS.SEARCH}`,
    "Content-Type": "application/json",
  },
});

const index = client.index("all");

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
      href={`/${type}/${id}`}
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
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 200);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  async function searchIndexes(value: string) {
    const search = await index.search(value);
    value.length > 0 ? setSearchResults(search.hits) : setSearchResults([]);
  }

  useEffect(() => {
    searchIndexes(debouncedSearchValue);
    if (debouncedSearchValue === "") setSearchResults([]);
  }, [debouncedSearchValue]);

  return (
    <>
      <Modal
        title={<Title order={3}>Search</Title>}
        opened={opened}
        onClose={() => {
          setOpened(false);
          setSearchValue("");
          setSearchResults([]);
        }}
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
            ? searchResults.map((result) => (
                <SearchCard
                  key={result.unique_id}
                  type={result.type}
                  id={result.unique_id.split("__")[1]}
                  content={
                    result.en__title ||
                    result.en__name ||
                    result["data-tl__en__name"] ||
                    `${result["data-tl__en__first_name"]} ${result["data-tl__en__last_name"]}`
                  }
                  onClick={() => {
                    setOpened(false);
                    setSearchValue("");
                    setSearchResults([]);
                  }}
                />
              ))
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
