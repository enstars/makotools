import React, { SyntheticEvent, useState } from "react";
import { Box, Text, ActionIcon, Popover, Divider, Button } from "@mantine/core";
import {
  IconMinus,
  IconPlaylistAdd,
  IconPlus,
  IconChecklist,
} from "@tabler/icons";

import { CardCollection } from "types/makotools";
import { MAX_CARD_COPIES } from "services/game";
import { GameCard, ID } from "types/game";

function EditCollectionRow({
  collection,
  card,
  onEditCollection,
}: {
  collection: CardCollection;
  card: GameCard;
  onEditCollection: (params: {
    collectionId: CardCollection["id"];
    cardId: ID;
    numCopies: number;
  }) => any;
}) {
  const collectedCardData = collection.cards.find((c) => c.id === card.id);

  return (
    <>
      <Text
        size="xs"
        sx={{
          paddingRight: "20px",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {collection.name}
      </Text>
      <ActionIcon
        variant="subtle"
        color="red"
        onClick={(e: SyntheticEvent) => {
          e.stopPropagation();
          const numCopies = collectedCardData ? collectedCardData.count - 1 : 0;
          onEditCollection({
            collectionId: collection.id,
            cardId: card.id,
            numCopies,
          });
        }}
        disabled={!collectedCardData || collectedCardData?.count <= 0}
      >
        <IconMinus size={16} />
      </ActionIcon>
      <Text size="xs" sx={{ padding: "0 8px" }}>
        {collectedCardData ? collectedCardData.count : 0}
      </Text>
      <ActionIcon
        variant="subtle"
        color="green"
        onClick={(e: SyntheticEvent) => {
          e.stopPropagation();
          const numCopies = collectedCardData ? collectedCardData.count + 1 : 1;
          onEditCollection({
            collectionId: collection.id,
            cardId: card.id,
            numCopies,
          });
        }}
        disabled={
          collectedCardData && collectedCardData?.count >= MAX_CARD_COPIES
        }
      >
        <IconPlus size={16} />
      </ActionIcon>
    </>
  );
}

function AddCollectionRow() {
  return (
    <Box sx={{ padding: "8px" }}>
      <Button compact size="xs" onClick={() => {}}>
        + Add collection
      </Button>
    </Box>
  );
}

export default function AddCardButton({
  card,
  collections,
  onEditCollection,
}: {
  collections: CardCollection[];
  card: GameCard;
  onEditCollection: (params: {
    collectionId: CardCollection["id"];
    cardId: ID;
    numCopies: number;
  }) => any;
}) {
  const [collectionMenuOpened, setCollectionMenuOpened] = useState(false);

  const isInACollection = collections.some((collection) =>
    collection.cards?.some((c) => c.id === card.id)
  );

  return (
    <Box
      sx={(theme) => ({
        marginLeft: theme.spacing.xs / 2,
      })}
      onClick={(e: SyntheticEvent) => {
        e.stopPropagation();
        setCollectionMenuOpened((o) => !o);
      }}
    >
      <Popover
        offset={4}
        opened={collectionMenuOpened}
        onChange={setCollectionMenuOpened}
        styles={{ dropdown: { padding: 0 } }}
        position="right"
        withinPortal
      >
        <Popover.Target>
          <ActionIcon
            variant="light"
            color={isInACollection ? "green" : undefined}
          >
            {isInACollection ? (
              <IconChecklist size={16} />
            ) : (
              <IconPlaylistAdd size={16} />
            )}
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "1fr fit-content(100px) fit-content(100px) fit-content(100px)",
              alignItems: "center",
              padding: "8px",
              rowGap: "8px",
              maxWidth: "250px",
            }}
          >
            {collections.map((collection) => (
              <React.Fragment key={collection.id}>
                <EditCollectionRow
                  collection={collection}
                  card={card}
                  onEditCollection={onEditCollection}
                />
              </React.Fragment>
            ))}
          </Box>
          <Divider />
          <AddCollectionRow />
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}
