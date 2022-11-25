import {
  Accordion,
  Box,
  Button,
  Group,
  Space,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconCircle,
  IconDeviceFloppy,
  IconHeart,
  IconMoodCry,
  IconPencil,
  IconPlus,
  IconStar,
  IconX,
} from "@tabler/icons";
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

  const ICON_SIZE = 25;
  const ICONS = [
    <ThemeIcon variant="outline" key="default">
      <IconCircle />
    </ThemeIcon>,
    <ThemeIcon variant="outline" key="heart">
      <IconHeart />
    </ThemeIcon>,
    <ThemeIcon variant="outline" key="star">
      <IconStar />
    </ThemeIcon>,
    <ThemeIcon variant="outline" key="cry">
      <IconMoodCry />
    </ThemeIcon>,
  ];

  console.log(profileCollections);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [collections, handlers] = useListState<CardCollection>([
    {
      id: 1,
      name: "Collection",
      icon: 0,
      privacyLevel: 0,
      default: true,
      cards: profile.collection || [],
    },
  ]);
  const isYourProfile = user.loggedIn && user.db.suid === profile.suid;
  const [editCards, setEditCards] = useState<boolean>(false);
  const [currentCollection, setCurrentCollection] =
    useState<CardCollection | null>(null);
  const [defaultCollection, setDefault] = useState<CardCollection>(
    collections.filter((collection) => collection.default)[0]
  );

  const prevState = collections;

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
              index={index}
              icons={ICONS}
              handlers={handlers}
              defaultCollection={defaultCollection}
              cardsFunction={setEditCards}
              setFunction={setCurrentCollection}
              defaultFunction={setDefault}
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

  useEffect(() => {
    collections.forEach((collection) => {
      if (defaultCollection.id !== collection.id) collection.default = false;
    });
  }, [defaultCollection]);

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
                onClick={() => {
                  setEditMode(!editMode);
                  setCurrentCollection(null);
                  setEditCards(!editCards);
                }}
              >
                Save
              </Button>
              <Button
                color="indigo"
                radius="xl"
                variant="subtle"
                leftIcon={<IconX />}
                onClick={() => {
                  setEditMode(!editMode);
                  setCurrentCollection(null);
                  setEditCards(!editCards);
                  handlers.setState(prevState);
                }}
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
                      icon: 0,
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
              handlers={handlers}
              index={collections.indexOf(currentCollection)}
              cardsFunction={setEditCards}
              setFunction={setCurrentCollection}
            />
          ) : (
            <Accordion
              variant="contained"
              defaultValue={defaultCollection.name}
            >
              {collections.map((collection) => (
                <CollectionFolder
                  key={collection.id}
                  collection={collection}
                  icons={ICONS}
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
