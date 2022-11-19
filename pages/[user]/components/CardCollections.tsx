import {
  Accordion,
  Box,
  Button,
  Group,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconDeviceFloppy, IconPencil, IconPlus, IconX } from "@tabler/icons";
import { useState } from "react";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import CollectionFolder from "./CollectionFolder";

import { CardCollection, User, UserData } from "types/makotools";
import { CONSTANTS } from "services/makotools/constants";

function CardCollections({ user, profile }: { user: User; profile: UserData }) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [collections, handlers] = useListState([
    {
      id: 0,
      name: "Collection #1",
      privacyLevel: 0,
      default: true,
      cards: profile.collection || [],
    },
  ]);
  const isYourProfile = user.loggedIn && user.db.suid === profile.suid;

  function removeCollection(collection: CardCollection) {
    handlers.remove(collections.indexOf(collection));
  }

  const collectionFolders = collections.map((collection, index) => (
    <Draggable key={`${index}`} index={index} draggableId={`${index}`}>
      {(provided, snapshot) => (
        <Box
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{ marginBottom: "10px" }}
        >
          <CollectionFolder
            collection={collection}
            editing={editMode}
            deleteFunction={removeCollection}
          />
        </Box>
      )}
    </Draggable>
  ));

  return (
    <Box>
      <Group>
        <Title order={2} mt="md" mb="xs">
          Collections
        </Title>
        {isYourProfile &&
          (editMode ? (
            <Group>
              <Button
                color="indigo"
                radius="xl"
                variant="subtle"
                leftIcon={<IconDeviceFloppy />}
                onClick={() => setEditMode(!editMode)}
              >
                Save
              </Button>
              <Button
                color="indigo"
                radius="xl"
                variant="subtle"
                leftIcon={<IconX />}
                onClick={() => setEditMode(!editMode)}
              >
                Cancel
              </Button>
            </Group>
          ) : (
            <Button
              color="indigo"
              radius="xl"
              variant="subtle"
              leftIcon={<IconPencil />}
              onClick={() => setEditMode(!editMode)}
            >
              Edit
            </Button>
          ))}
      </Group>
      <Space h="sm" />
      {!profile?.collection?.length ? (
        <Text color="dimmed" size="sm">
          This user has no card collections.
          {isYourProfile && (
            <Button color="indigo" variant="outline" leftIcon={<IconPlus />}>
              Create a collection
            </Button>
          )}
        </Text>
      ) : (
        <Stack align="stretch">
          {editMode &&
            collections.length <
              CONSTANTS.PATREON.TIERS[profile.admin?.patreon || 0]
                .COLLECTIONS && (
              <Button
                color="indigo"
                variant="outline"
                leftIcon={<IconPlus />}
                onClick={() => {
                  handlers.prepend({
                    id: collections.length + 1,
                    name: `Collection #${collections.length + 1}`,
                    privacyLevel: 0,
                    default: false,
                    cards: [],
                  });
                }}
              >
                Add collection
              </Button>
            )}
          {editMode ? (
            <DragDropContext
              onDragEnd={({ destination, source }) => {
                handlers.reorder({
                  from: source.index,
                  to: destination?.index || 0,
                });
              }}
            >
              <Droppable droppableId="dnd-list" direction="vertical">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {collectionFolders}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <Accordion
              variant="contained"
              defaultValue={`${
                collections.filter((collection) => collection.default)[0].id
              }`}
            >
              {collections.map((collection) => (
                <CollectionFolder
                  key={collection.id}
                  collection={collection}
                  editing={editMode}
                  deleteFunction={removeCollection}
                />
              ))}
            </Accordion>
          )}
        </Stack>
      )}
    </Box>
  );
}

export default CardCollections;
