import { Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconDeviceFloppy, IconPencil, IconPlus } from "@tabler/icons";
import { useState } from "react";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import CollectionFolder from "./CollectionFolder";

import { CardCollection, User, UserData } from "types/makotools";

function CardCollections({ user, profile }: { user: User; profile: UserData }) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [values, handlers] = useListState([
    {
      name: "Collection #1",
      privacyLevel: 0,
      default: true,
      cards: profile.collection || [],
    },
  ]);
  const isYourProfile = user.loggedIn && user.db.suid === profile.suid;

  function removeCollection(collection: CardCollection) {
    handlers.remove(values.indexOf(collection));
  }

  const collectionFolders = values.map((collection, index) => (
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
        {isYourProfile && (
          <Button
            color="indigo"
            radius="xl"
            variant="subtle"
            leftIcon={editMode ? <IconDeviceFloppy /> : <IconPencil />}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
        )}
      </Group>
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
          {editMode && (
            <Button
              color="indigo"
              variant="outline"
              leftIcon={<IconPlus />}
              onClick={() => {
                handlers.prepend({
                  name: `Collection #${values.length + 1}`,
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
            values.map((collection, index) => (
              <CollectionFolder
                key={index}
                collection={collection}
                editing={editMode}
                deleteFunction={removeCollection}
              />
            ))
          )}
        </Stack>
      )}
    </Box>
  );
}

export default CardCollections;
