import React, { SyntheticEvent, useState } from "react";
import {
  Box,
  Text,
  ActionIcon,
  Popover,
  Divider,
  Button,
  NumberInput,
} from "@mantine/core";
import { IconPlaylistAdd, IconChecklist, IconPlus } from "@tabler/icons-react";
import { inRange, isNil, sortBy } from "lodash";

import { CardCollection } from "types/makotools";
import { MAX_CARD_COPIES } from "services/game";
import { GameCard } from "types/game";
import { CONSTANTS } from "services/makotools/constants";
import useUser from "services/firebase/user";
import { UseMutationResult } from "@tanstack/react-query";

function EditCollectionRow({
  collection,
  card,
  editCollection,
}: {
  collection: CardCollection;
  card: GameCard;
  editCollection: UseMutationResult<
    void,
    Error,
    {
      collectionId: string | number;
      cardId: number;
      numCopies: number;
    },
    unknown
  >;
}) {
  const collectedCardData = collection.cards.find((c) => c.id === card.id);
  const isInCollection = !!collectedCardData;

  return (
    <>
      <Text
        size="xs"
        sx={{
          paddingRight: "20px",
          overflow: "hidden",
          wordWrap: "break-word",
        }}
      >
        {collection.name}
      </Text>
      {/* Needed to stop input events from closing Popover */}
      <Box
        onClick={(e: SyntheticEvent) => {
          e.stopPropagation();
        }}
        sx={{ display: "flex", justifyContent: "end" }}
      >
        {isInCollection ? (
          <NumberInput
            value={collectedCardData.count}
            min={0}
            max={5}
            onChange={(value) => {
              if (isNil(value) || !inRange(value, 0, MAX_CARD_COPIES + 1)) {
                return;
              }
              editCollection.mutate({
                collectionId: collection.id,
                cardId: card.id,
                numCopies: value,
              });
            }}
            size="xs"
            sx={{ maxWidth: "48px" }}
          />
        ) : (
          <ActionIcon
            // Same height as NumberInput
            // so that height of row doesn't change when switching over
            // to NumberInput
            size={30}
            variant="light"
            color="green"
            onClick={() =>
              editCollection.mutate({
                collectionId: collection.id,
                cardId: card.id,
                numCopies: 1,
              })
            }
          >
            <IconPlus size={16} />
          </ActionIcon>
        )}
      </Box>
    </>
  );
}

function NewCollectionRow({
  collections,
  onNewCollection,
}: {
  collections: CardCollection[];
  onNewCollection: () => any;
}) {
  const { userDB } = useUser();
  const disabled =
    collections.length >=
    (userDB
      ? CONSTANTS.PATREON.TIERS[userDB?.admin?.patreon || 0].COLLECTIONS
      : CONSTANTS.PATREON.TIERS[0].COLLECTIONS);

  return (
    <Box sx={{ padding: "8px" }}>
      <Button
        compact
        size="xs"
        onClick={(e: SyntheticEvent) => {
          e.stopPropagation();
          onNewCollection();
        }}
        disabled={disabled}
      >
        + New collection
      </Button>
      {disabled && (
        <Text size="xs" color="dimmed" sx={{ marginTop: "8px" }}>
          You have the maximum number of collections for your Patreon tier.
        </Text>
      )}
    </Box>
  );
}

export default function AddCardButton({
  card,
  collections,
  editCollection,
  onNewCollection,
}: {
  collections: CardCollection[];
  card: GameCard;
  editCollection: UseMutationResult<
    void,
    Error,
    {
      collectionId: string | number;
      cardId: number;
      numCopies: number;
    },
    unknown
  >;
  onNewCollection: () => any;
}) {
  const [collectionMenuOpened, setCollectionMenuOpened] = useState(false);

  const isInAnyCollection = collections.some((collection) =>
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
        width={250}
      >
        <Popover.Target>
          <ActionIcon
            variant="light"
            color={isInAnyCollection ? "green" : undefined}
          >
            {isInAnyCollection ? (
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
              gridTemplateColumns: "1fr fit-content(100px)",
              alignItems: "center",
              padding: "8px",
              rowGap: "8px",
              // Show at most 5 collections before scrolling
              maxHeight: `${36 * 5 + 8 * 6}px`,
              overflow: "auto",
            }}
          >
            {sortBy(collections, "order").map((collection) => (
              <React.Fragment key={collection.id}>
                <EditCollectionRow
                  collection={collection}
                  card={card}
                  editCollection={editCollection}
                />
              </React.Fragment>
            ))}
          </Box>
          <Divider />
          <NewCollectionRow
            collections={collections}
            onNewCollection={() => {
              setCollectionMenuOpened(false);
              onNewCollection();
            }}
          />
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}
