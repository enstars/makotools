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
import { GameCard, GameUnit } from "types/game";

function EditCollectionCards({
  collection,
  units,
  allCards,
  handlers,
  index,
  cardsFunction,
  setFunction,
}: {
  collection: CardCollection;
  units: GameUnit[];
  allCards: GameCard[];
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

                break;
              case "charId":
                sorted = cards.sort((a: CollectedCard, b: CollectedCard) => {
                  let charA =
                    allCards.find((c) => c.id === a.id)?.character_id || 0;
                  let charB =
                    allCards.find((c) => c.id === b.id)?.character_id || 0;
                  return charA - charB;
                });
                break;
              case "cardId":
                sorted = cards.sort(
                  (a: CollectedCard, b: CollectedCard) => a.id - b.id
                );
                break;
              case "amount":
                sorted = cards.sort(
                  (a: CollectedCard, b: CollectedCard) => b.count - a.count
                );
              case "rarity":
                sorted = cards.sort((a: CollectedCard, b: CollectedCard) => {
                  let rarityA =
                    allCards.find((c) => c.id === a.id)?.rarity || 0;
                  let rarityB =
                    allCards.find((c) => c.id === b.id)?.rarity || 0;
                  return rarityB - rarityA;
                });
              default:
                break;
            }
            sorted && handlers.setItemProp(index, "cards", sorted);
          }}
        />
      )}
      <Space h="lg" />
      {collection.cards && collection.cards.length > 0 ? (
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
              {collection.cards
                .filter((c: CollectedCard) => c.count)
                .map((c: CollectedCard, index: number) => (
                  <GridItem key={c.id}>
                    <CollectionCard
                      card={c}
                      editing={true}
                      collHandlers={handlers}
                      handlers={cardHandlers}
                      index={index}
                    />
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
