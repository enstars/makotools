import React, { SyntheticEvent } from "react";
import { Box, Text, ActionIcon, Popover, Stack } from "@mantine/core";
import { IconMinus, IconPlaylistAdd, IconPlus } from "@tabler/icons";

import { addCard } from "services/makotools/collection";

export default function AddCardButton({
  thisColItem,
  collection,
  card,
  user,
  setCollectionOpened,
  collectionOpened,
}) {
  return (
    <Box
      sx={(theme) => ({
        marginLeft: theme.spacing.xs / 2,
      })}
      onClick={(e: SyntheticEvent) => {
        e.stopPropagation();
        if (!thisColItem) {
          const newCollection = addCard(collection, card.id, 1);
          user.db.set({ collection: newCollection });
        } else {
          setCollectionOpened((o) => !o);
        }
      }}
    >
      <Popover
        offset={4}
        opened={collectionOpened}
        onChange={setCollectionOpened}
        styles={{ dropdown: { padding: 0 } }}
        position="right"
        withinPortal
      >
        <Popover.Target>
          <ActionIcon
            variant="light"
            {...(thisColItem && thisColItem?.count > 0
              ? { color: "orange" }
              : {})}
          >
            {thisColItem && thisColItem?.count > 0 ? (
              <Text inline size="xs" weight="700">
                {thisColItem.count}
                <Text
                  component="span"
                  sx={{ verticalAlign: "-0.05em", lineHeight: 0 }}
                >
                  ×
                </Text>
              </Text>
            ) : (
              <IconPlaylistAdd size={16} />
            )}
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack spacing={0}>
            <ActionIcon
              variant="subtle"
              color="green"
              onClick={(e: SyntheticEvent) => {
                e.stopPropagation();

                const newCollection = addCard(collection, card.id, 1);
                user.db.set({ collection: newCollection });
              }}
              disabled={thisColItem && thisColItem?.count >= 5}
            >
              <IconPlus size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={(e: SyntheticEvent) => {
                e.stopPropagation();

                const newCollection = addCard(collection, card.id, -1);
                user.db.set({ collection: newCollection });
              }}
              disabled={!thisColItem || thisColItem?.count <= 0}
            >
              <IconMinus size={16} />
            </ActionIcon>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}
