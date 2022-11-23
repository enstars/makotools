import {
  ActionIcon,
  Box,
  Group,
  Select,
  Space,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  IconArrowsSort,
  IconChevronLeft,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons";
import { Dispatch, SetStateAction, useState } from "react";
import { GridContextProvider, GridDropZone, GridItem } from "react-grid-drag";

import CollectionCard from "./CollectionCard";

import { CardCollection, CollectedCard } from "types/makotools";

function EditCollectionCards({
  collection,
  cardsFunction,
  setFunction,
}: {
  collection: CardCollection;
  cardsFunction: Dispatch<SetStateAction<boolean>>;
  setFunction: Dispatch<SetStateAction<CardCollection | null>>;
}) {
  const [asc, setAsc] = useState<boolean>(true);
  // const [cards, handlers] = useState<CollectedCard[]>(collection.cards);
  const [cards, handlers] = useListState<CollectedCard>(collection.cards);

  const NUM_COLS =
    window.innerWidth < 768
      ? 2
      : window.innerWidth > 786 && window.innerWidth < 900
      ? 4
      : 5;

  const ROW_HEIGHT = 200;

  const height = Math.ceil(collection.cards.length / NUM_COLS) * ROW_HEIGHT;

  return (
    <Box>
      <Group>
        <ActionIcon
          onClick={() => {
            cardsFunction(false);
            setFunction(null);
          }}
        >
          <IconChevronLeft size={40} strokeWidth={3} />
        </ActionIcon>
        <Title order={3}>Edit {collection.name} cards</Title>
      </Group>
      <Space h="md" />
      {collection.cards.length > 1 && (
        <Select
          placeholder="Sort by..."
          data={[
            { value: "dateAdded", label: "Date added" },
            { value: "charId", label: "Character ID" },
            { value: "cardId", label: "Card ID" },
            { value: "rarity", label: "Card rarity" },
          ]}
          icon={<IconArrowsSort size="1em" />}
          rightSection={
            <Tooltip label="Toggle ascending/descending">
              <ActionIcon variant="light" color="blue">
                {asc ? (
                  <IconSortAscending size={16} />
                ) : (
                  <IconSortDescending size={16} />
                )}
              </ActionIcon>
            </Tooltip>
          }
        />
      )}
      <Space h="lg" />
      {cards && cards.length > 0 ? (
        <Box sx={{ width: "100%", height: "100%" }}>
          <GridContextProvider
            onChange={(
              sourceId: string,
              sourceIndex: number,
              targetIndex: number,
              targetId: string
            ) => {
              // const nextState = swap(cards, sourceIndex, targetIndex);
              // console.log(cards, nextState);
              // handlers(nextState);
              handlers.reorder({ from: sourceIndex, to: targetIndex });
            }}
          >
            <GridDropZone
              id="card-drop-zone"
              boxesPerRow={NUM_COLS}
              rowHeight={ROW_HEIGHT}
              style={{
                width: "100%",
                height: height,
              }}
            >
              {cards
                .filter((c: CollectedCard) => c.count)
                // .sort((a: CollectedCard, b: CollectedCard) => b.count - a.count)
                .map((c: CollectedCard) => (
                  <GridItem key={c.id}>
                    <CollectionCard card={c} editing={true} />
                  </GridItem>
                ))}
            </GridDropZone>
          </GridContextProvider>
        </Box>
      ) : (
        <Text color="dimmed">This collection is empty.</Text>
      )}
    </Box>
  );
}

export default EditCollectionCards;
