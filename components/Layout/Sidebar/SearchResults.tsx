import { Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { MeiliSearch } from "meilisearch";
import Link from "next/link";
import { useDebouncedValue } from "@mantine/hooks";
import { IconAward, IconCards, IconDiamond, IconUsers } from "@tabler/icons";

import { SidebarLink } from ".";

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
    <SidebarLink
      component={Link}
      href={`/${type}/${id}`}
      name={content}
      // @ts-ignore
      onClick={onClick}
      description={type}
      Icon={
        type === "cards"
          ? IconCards
          : type === "characters"
          ? IconUsers
          : type === "events"
          ? IconAward
          : type === "scouts"
          ? IconDiamond
          : undefined
      }
      styles={{
        description: {
          textTransform: "capitalize",
        },
      }}
    />
  );
}

function SearchResults({
  searchValue,
  setSearchValue,
}: {
  searchValue: string;
  setSearchValue: (s: string) => void;
}) {
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 200);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchIndexes = useCallback(
    async (value: string) => {
      const search = await index.search(value);
      if (value.length > 0) {
        setSearchResults(search.hits);
      } else {
        setSearchResults([]);
      }
    },
    [setSearchResults, index]
  );

  useEffect(() => {
    searchIndexes(debouncedSearchValue);
    if (debouncedSearchValue === "") setSearchResults([]);
  }, [debouncedSearchValue]);

  return (
    <>
      {searchResults.length > 0 ? (
        searchResults.map((result) => (
          <SearchCard
            key={result.unique_id}
            type={result.type}
            id={result.unique_id.split("__")[1]}
            content={
              result["data-tl__en__title"] ||
              result["data__en__name"] ||
              result["data-tl__en__name"] ||
              `${result["data-tl__en__first_name"]} ${result["data-tl__en__last_name"]}`
            }
            onClick={() => {
              setSearchValue("");
              setSearchResults([]);
            }}
          />
        ))
      ) : (
        <Text color="dimmed" weight="500" size="sm" p="xs" align="center">
          No search results found
        </Text>
      )}
    </>
  );
}

export default SearchResults;
