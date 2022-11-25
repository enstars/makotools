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
import { useListState, UseListStateHandlers } from "@mantine/hooks";
import {
  IconArrowsSort,
  IconChevronLeft,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GridContextProvider, GridDropZone, GridItem } from "react-grid-drag";

import CollectionCard from "./CollectionCard";

import { useDayjs } from "services/libraries/dayjs";
import { CardCollection, CollectedCard } from "types/makotools";

function EditCollectionCards({
  collection,
  handlers,
  index,
  cardsFunction,
  setFunction,
}: {
  collection: CardCollection;
  handlers: UseListStateHandlers<CardCollection>;
  index: number;
  cardsFunction: Dispatch<SetStateAction<boolean>>;
  setFunction: Dispatch<SetStateAction<CardCollection | null>>;
}) {
  const { dayjs } = useDayjs();
  const [asc, setAsc] = useState<boolean>(true);
  const [cards, cardHandlers] = useListState<CollectedCard>(
    collection.cards || []
  );

  useEffect(() => {
    handlers.setItemProp(index, "cards", cards);
  }, [cards]);

  const NUM_COLS =
    window.innerWidth < 768
      ? 2
      : window.innerWidth > 786 && window.innerWidth < 900
      ? 4
      : 5;

  const ROW_HEIGHT = 200;

  const height = Math.ceil(cards.length / NUM_COLS) * ROW_HEIGHT;

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
      {cards.length > 1 && (
        <Select
          placeholder="Sort by..."
          data={[
            { value: "dateAdded", label: "Date added" },
            { value: "charId", label: "Character ID" },
            { value: "cardId", label: "Card ID" },
            { value: "amount", label: "Card amount" },
            { value: "rarity", label: "Card rarity" },
          ]}
          icon={<IconArrowsSort size="1em" />}
          rightSection={
            <Tooltip label="Toggle ascending/descending">
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => {
                  const reversed = cards.reverse();
                  handlers.setItemProp(index, "cards", reversed);
                }}
              >
                {asc ? (
                  <IconSortAscending size={16} />
                ) : (
                  <IconSortDescending size={16} />
                )}
              </ActionIcon>
            </Tooltip>
          }
          onChange={(value) => {
            let sorted;
            switch (value) {
              case "dateAdded":
                sorted = cards.sort((a: CollectedCard, b: CollectedCard) =>
                  dayjs(a.dateAdded).diff(dayjs(b.dateAdded))
                );

                handlers.setItemProp(index, "cards", sorted);
                break;
              case "cardId":
                sorted = cards.sort(
                  (a: CollectedCard, b: CollectedCard) => a.id - b.id
                );
                handlers.setItemProp(index, "cards", sorted);
                break;
              case "amount":
                sorted = cards.sort(
                  (a: CollectedCard, b: CollectedCard) => b.count - a.count
                );
                handlers.setItemProp(index, "cards", sorted);
              default:
                break;
            }
          }}
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
              cardHandlers.reorder({ from: sourceIndex, to: targetIndex });
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
