import { Paper, Group, Button, Text, Box } from "@mantine/core";
import { IconMenu2, IconPencil } from "@tabler/icons";

import { ICONS } from "./icons";

import { CardCollection } from "types/makotools";

function EditCollectionFolder({
  collection,
  setFunction,
  reordering = false,
}: {
  collection: CardCollection;
  setFunction: (c: CardCollection) => void;
  reordering?: boolean;
}) {
  const icon = ICONS[collection.icon || 0];
  return (
    <>
      <Paper
        withBorder
        py="xs"
        px="md"
        sx={{
          boxSizing: "border-box",
        }}
      >
        <Group position="apart">
          <Group>
            <Text color={icon.color} inline>
              <icon.component {...icon.props} />
            </Text>
            <Box>
              <Text size="md" weight={800}>
                {collection.name}
              </Text>
              <Text size="xs" weight={500} color="dimmed">
                {collection.cards.length} cards in collection
              </Text>
            </Box>
          </Group>
          {reordering ? (
            <Text color="dimmed">
              <IconMenu2 size={16} />
            </Text>
          ) : (
            <Button
              onClick={() => {
                setFunction(collection);
              }}
              variant="default"
              rightIcon={<IconPencil size={16} />}
            >
              <Text>Edit</Text>
            </Button>
          )}
        </Group>
      </Paper>
    </>
  );
}

export default EditCollectionFolder;
