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
import { useEffect, useState } from "react";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import useSWR from "swr";

import CollectionFolder from "./CollectionFolder";
import EditCollectionFolder from "./EditCollectionFolder";
import EditCollectionCards from "./EditCollectionCards";

import { CardCollection, User, UserData } from "types/makotools";
import { CONSTANTS } from "services/makotools/constants";
import { getFirestoreUserCollection } from "services/firebase/firestore";
function CardCollections({
  user,
  profile,
  uid: profileUid,
}: {
  user: User;
  profile: UserData;
  uid: string;
}) {
  const { profileCollections, error } = useSWR(
    `users/${profileUid}/collections`,
    getFirestoreUserCollection
  );

  console.log(profileCollections);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [collections, handlers] = useListState([
    {
      id: 1,
      name: "Collection",
      privacyLevel: 0,
      default: true,
      cards: profile.collection || [],
    },
  ]);
  const isYourProfile = user.loggedIn && user.db.suid === profile.suid;
  const [editCards, setEditCards] = useState<boolean>(false);
  const [currentCollection, setCurrentCollection] =
    useState<CardCollection | null>(null);

  function removeCollection(collection: CardCollection) {
    handlers.remove(collections.indexOf(collection));
  }

  function createEditFolders(collections: CardCollection[]) {
    return collections.map((collection, index) => (
      <Draggable key={collection.id} index={index} draggableId={`${index}`}>
        {(provided, snapshot) => (
          <Box
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            sx={{ marginBottom: "10px" }}
          >
            <EditCollectionFolder
              collection={collection}
              deleteFunction={removeCollection}
              cardsFunction={setEditCards}
              setFunction={setCurrentCollection}
            />
          </Box>
        )}
      </Draggable>
    ));
  }

  let collectionFolders = createEditFolders(collections);

  useEffect(() => {
    let collectionFolders = createEditFolders(collections);
  }, [collections]);

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
          {editMode && !editCards ? (
            <>
              {collections.length <
                CONSTANTS.PATREON.TIERS[profile.admin?.patreon || 0]
                  .COLLECTIONS && (
                <Button
                  color="indigo"
                  variant="outline"
                  leftIcon={<IconPlus />}
                  onClick={() => {
                    handlers.prepend({
                      id: collections.length + 1,
                      name: `Collection #${collections.length}`,
                      privacyLevel: 0,
                      default: false,
                      cards: [],
                    });
                    console.log(collections);
                  }}
                >
                  Add collection
                </Button>
              )}
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
            </>
          ) : editMode && editCards && currentCollection ? (
            <EditCollectionCards
              collection={currentCollection}
              cardsFunction={setEditCards}
              setFunction={setCurrentCollection}
            />
          ) : (
            <Accordion
              variant="contained"
              defaultValue={`${
                collections.filter((collection) => collection.default)[0].id
              }`}
            >
              {collections.map((collection) => (
                <CollectionFolder key={collection.id} collection={collection} />
              ))}
            </Accordion>
          )}
        </Stack>
      )}
    </Box>
  );
}

export default CardCollections;
