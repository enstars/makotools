import { Paper, Group, Button, Text, Box, Tooltip } from "@mantine/core";
import { IconMenu2, IconPencil } from "@tabler/icons";

import PRIVACY_LEVELS from "components/collections/privacyLevels";
import { COLLECTION_ICONS } from "components/collections/collectionIcons";
import { CardCollection } from "types/makotools";

function EditCollectionRow({
  collection,
  setFunction,
  reordering = false,
}: {
  collection: CardCollection;
  setFunction: (c: CardCollection) => void;
  reordering?: boolean;
}) {
  const icon = COLLECTION_ICONS[collection.icon || 0];
  const privacy = PRIVACY_LEVELS[collection.privacyLevel];
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
                <Tooltip
                  label={
                    <Text size="xs" weight={500}>
                      {privacy.description}
                    </Text>
                  }
                  position="top"
                  withinPortal
                >
                  <Text
                    inline
                    span
                    ml="xs"
                    sx={{ verticalAlign: -2 }}
                    color="dimmed"
                  >
                    <privacy.icon size={16} />
                  </Text>
                </Tooltip>
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

export default EditCollectionRow;
