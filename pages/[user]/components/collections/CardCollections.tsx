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
import { doc, getFirestore, setDoc, writeBatch } from "firebase/firestore";
import { isEqual } from "lodash";

import CollectionFolder from "./CollectionFolder";
import EditCollectionFolder from "./EditCollectionFolder";
import EditCollectionCards from "./EditCollectionCards";

import { CardCollection, UserData } from "types/makotools";
import { CONSTANTS } from "services/makotools/constants";
import { getFirestoreUserCollection } from "services/firebase/firestore";
import IconEnstars from "components/core/IconEnstars";
import { GameCard, GameUnit } from "types/game";
import useUser from "services/firebase/user";
import { generateUUID } from "services/utilities";
function CardCollections({
  profile,
  uid: profileUid,
  cards,
  units,
}: {
  profile: UserData;
  uid: string;
  cards: GameCard[];
  units: GameUnit[];
}) {
  const user = useUser();
  const {
    data: profileCollections,
    error,
    isLoading,
    mutate,
  } = useSWR<CardCollection[]>(
    [`users/${profileUid}/card_collections`, user],
    getFirestoreUserCollection
  );

  let ICONS = [
    <ThemeIcon key="default">
      <IconCircle />
    </ThemeIcon>,
    <ThemeIcon color="pink" key="heart">
      <IconHeart />
    </ThemeIcon>,
    <ThemeIcon color="yellow" key="star">
      <IconStar />
    </ThemeIcon>,
    <ThemeIcon color="cyan" key="cry">
      <IconMoodCry />
    </ThemeIcon>,
  ];

  units.forEach((unit: GameUnit) =>
    ICONS.push(
      <ThemeIcon key={unit.id} color={unit.image_color}>
        <IconEnstars unit={unit.id} />
      </ThemeIcon>
    )
  );

  const [editMode, setEditMode] = useState<boolean>(false);
  const [isReordering, setIsReordering] = useState<boolean>(false);
  const [collections, collectionHandlers] =
    useListState<CardCollection>(profileCollections);
  const [editingCollections, editingHandlers] = useListState<CardCollection>();
  const [tempCollectionsWhileReordering, tempHandlersWhileReordering] =
    useListState<CardCollection>([]);
  const isYourProfile = user.loggedIn && user.db.suid === profile.suid;
  const [currentCollection, setCurrentCollection] = useState<
    CardCollection | undefined
  >(undefined);
  const [defaultCollection, setDefault] = useState<CardCollection | null>(
    collections.filter((collection) => collection.default)[0]
  );

  useEffect(() => {
    if (!isLoading && profileCollections)
      collectionHandlers.setState(profileCollections);
  }, [profileCollections, isLoading, collectionHandlers]);

  useEffect(() => {
    collections.forEach((collection) => {
      if (defaultCollection?.id !== collection.id) collection.default = false;
    });
  }, [defaultCollection]);

  const saveReorder = async () => {
    if (!user.loggedIn) return;
    const db = getFirestore();
    // Get a new write batch
    const batch = writeBatch(db);

    tempCollectionsWhileReordering.forEach((collection, index) => {
      editingHandlers.setItemProp(
        editingCollections.indexOf(
          editingCollections.find(
            (c) => c.id === collection.id
          ) as CardCollection
        ),
        "order",
        index
      );
      tempCollectionsWhileReordering[index].order = index;
      const collectionRef = doc(
        db,
        `users/${user.user.id}/card_collections`,
        collection.id
      );
      batch.update(collectionRef, { order: index });
    });

    // Commit the batch
    await batch.commit();

    mutate(tempCollectionsWhileReordering);
  };

  const saveChanges = async () => {};
  return (
    <Box>
      <Group>
        <Title order={2} mt="md" mb="xs">
          Collections
        </Title>
        {isYourProfile &&
          (editMode ? (
            isReordering ? (
              <>
                <Button
                  onClick={() => {
                    saveReorder();
                    setIsReordering(false);
                  }}
                >
                  Save
                </Button>
                <Button
                  leftIcon={<IconX />}
                  onClick={() => {
                    setIsReordering(false);
                    tempHandlersWhileReordering.setState(collections);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Group>
                <Button
                  leftIcon={<IconDeviceFloppy />}
                  onClick={async () => {
                    setEditMode(false);
                    setCurrentCollection(undefined);

                    const db = getFirestore();

                    // Get a new write batch
                    const batch = writeBatch(db);

                    collections.forEach((originalCollection) => {
                      const newCollection = editingCollections.find(
                        (c) => c.id === originalCollection.id
                      );
                      if (newCollection) {
                        if (!isEqual(originalCollection, newCollection)) {
                          const collectionRef = doc(
                            db,
                            `users/${user.user.id}/card_collections`,
                            newCollection.id
                          );
                          batch.set(collectionRef, newCollection, {
                            merge: true,
                          });
                        }
                      } else {
                        const collectionRef = doc(
                          db,
                          `users/${user.user.id}/card_collections`,
                          originalCollection.id
                        );
                        batch.delete(collectionRef);
                      }
                    });

                    await batch.commit();

                    mutate(editingCollections);
                  }}
                >
                  Save All Changes
                </Button>
                <Button
                  leftIcon={<IconX />}
                  onClick={() => {
                    setEditMode(false);
                    setCurrentCollection(undefined);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="indigo"
                  radius="xl"
                  variant="subtle"
                  leftIcon={<IconX />}
                  onClick={() => {
                    setIsReordering(true);
                    tempHandlersWhileReordering.setState(
                      collections.sort((a, b) => a.order - b.order)
                    );
                  }}
                >
                  Reorder
                </Button>
              </Group>
            )
          ) : (
            <Button
              color="indigo"
              radius="xl"
              variant="subtle"
              leftIcon={<IconPencil />}
              onClick={() => {
                setEditMode(true);
                editingHandlers.setState(collections);
              }}
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
          {user.loggedIn && editMode && !currentCollection ? (
            <>
              {collections.length <
                CONSTANTS.PATREON.TIERS[profile.admin?.patreon || 0]
                  .COLLECTIONS && (
                <Button
                  color="indigo"
                  variant="outline"
                  leftIcon={<IconPlus />}
                  onClick={async () => {
                    const newCollection: CardCollection = {
                      id: generateUUID(),
                      name: `Untitled Collection`,
                      icon: 0,
                      privacyLevel: 1,
                      default: false,
                      cards: [],
                      order: collections.length,
                    };
                    const db = getFirestore();
                    await setDoc(
                      doc(
                        db,
                        `users/${user.user.id}/card_collections`,
                        newCollection.id
                      ),
                      newCollection,
                      { merge: true }
                    );
                    mutate();
                  }}
                >
                  Add collection
                </Button>
              )}
              {isReordering ? (
                <DragDropContext
                  onDragEnd={async ({ destination, source }) => {
                    const db = getFirestore();
                    const from = source.index,
                      to = destination?.index || 0;
                    tempHandlersWhileReordering.reorder({ from, to });
                  }}
                >
                  <Droppable droppableId="dnd-list" direction="vertical">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {tempCollectionsWhileReordering.map(
                          (collection, index) => (
                            <Draggable
                              key={collection.id}
                              index={index}
                              draggableId={collection.id}
                            >
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
                                    handlers={editingHandlers}
                                    defaultCollection={defaultCollection}
                                    setFunction={setCurrentCollection}
                                    defaultFunction={setDefault}
                                  />
                                </Box>
                              )}
                            </Draggable>
                          )
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                editingCollections
                  .sort((a, b) => a.order - b.order)
                  .map((collection, index) => (
                    <EditCollectionFolder
                      key={collection.id}
                      collection={collection}
                      index={index}
                      icons={ICONS}
                      handlers={editingHandlers}
                      defaultCollection={defaultCollection}
                      setFunction={setCurrentCollection}
                      defaultFunction={setDefault}
                    />
                  ))
              )}
            </>
          ) : user.loggedIn && editMode && currentCollection ? (
            <EditCollectionCards
              collection={currentCollection}
              units={units}
              allCards={cards}
              handlers={editingHandlers}
              index={collections.indexOf(currentCollection)}
              setFunction={setCurrentCollection}
            />
          ) : (
            <Accordion
              variant="contained"
              defaultValue={defaultCollection?.name || null}
            >
              {collections
                .sort((a, b) => a.order - b.order)
                .map((collection) => (
                  <CollectionFolder
                    key={collection.id}
                    collection={collection}
                    icons={ICONS}
                    isYourProfile={isYourProfile}
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
