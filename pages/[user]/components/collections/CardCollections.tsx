import {
  Accordion,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconDeviceFloppy, IconPencil, IconX } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useListState } from "@mantine/hooks";
import useSWR from "swr";
import { doc, getFirestore, setDoc, writeBatch } from "firebase/firestore";
import { isEqual } from "lodash";

import EditAllCollections from "./EditAllCollections";
import CollectionFolder from "./CollectionFolder";

import { CardCollection, UserData } from "types/makotools";
import { getFirestoreUserCollection } from "services/firebase/firestore";
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
  const theme = useMantineTheme();
  const {
    data: profileCollections,
    isLoading,
    mutate,
  } = useSWR<CardCollection[]>(
    [`users/${profileUid}/card_collections`, user],
    getFirestoreUserCollection
  );

  const [collections, collectionHandlers] =
    useListState<CardCollection>(profileCollections);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingCollections, editingHandlers] = useListState<CardCollection>();

  const [tempCollectionsWhileReordering, tempHandlersWhileReordering] =
    useListState<CardCollection>([]);
  const [isReordering, setIsReordering] = useState<boolean>(false);

  const isYourProfile = user.loggedIn && user.db.suid === profile.suid;
  const [currentCollection, setCurrentCollection] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    if (!isLoading && profileCollections)
      collectionHandlers.setState(profileCollections);
  }, [profileCollections, isLoading, collectionHandlers]);

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

  const addNewCollection = async () => {
    if (!user.loggedIn) return;
    const newCollection: CardCollection = {
      id: generateUUID(),
      name: `Untitled Collection`,
      icon: 0,
      privacyLevel: 1,
      cards: [],
      order: collections.length,
    };
    const db = getFirestore();
    await setDoc(
      doc(db, `users/${user.user.id}/card_collections`, newCollection.id),
      newCollection,
      { merge: true }
    );
    mutate();
  };

  const saveAllChanges = async () => {
    if (!user.loggedIn) return;
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
  };

  return (
    <Box>
      <Group position="apart">
        <Title order={2} mt="md" mb="xs">
          Collections
        </Title>
        {isYourProfile &&
          (editMode ? (
            isReordering ? (
              <Group>
                <Button
                  variant="subtle"
                  color="red"
                  leftIcon={<IconX size={16} />}
                  onClick={() => {
                    setIsReordering(false);
                    tempHandlersWhileReordering.setState(collections);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  leftIcon={<IconDeviceFloppy size={16} />}
                  onClick={() => {
                    saveReorder();
                    setIsReordering(false);
                  }}
                >
                  Save
                </Button>
              </Group>
            ) : (
              <Group>
                <Button
                  variant="subtle"
                  color="red"
                  leftIcon={<IconX size={16} />}
                  onClick={() => {
                    setEditMode(false);
                    setCurrentCollection(undefined);
                  }}
                >
                  Discard Changes
                </Button>
                <Button
                  leftIcon={<IconDeviceFloppy size={16} />}
                  onClick={saveAllChanges}
                >
                  Save
                </Button>
              </Group>
            )
          ) : (
            <Button
              color={theme.primaryColor}
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
      {isLoading && !editMode ? (
        <Box>
          <Center>
            <Loader />
          </Center>
        </Box>
      ) : editMode ? (
        <EditAllCollections
          editMode={editMode}
          currentCollection={currentCollection}
          isReordering={isReordering}
          setCurrentCollection={setCurrentCollection}
          units={units}
          cards={cards}
          editingHandlers={editingHandlers}
          addNewCollection={addNewCollection}
          setIsReordering={setIsReordering}
          tempCollectionsWhileReordering={tempCollectionsWhileReordering}
          tempHandlersWhileReordering={tempHandlersWhileReordering}
          editingCollections={editingCollections}
          profile={profile}
        />
      ) : (
        <Accordion
          variant="separated"
          defaultValue={collections.sort((a, b) => a.order - b.order)?.[0]?.id}
          styles={(theme) => ({
            item: {
              "&&&&&": {
                marginTop: theme.spacing.xs,
                "&:first-of-type": {
                  marginTop: 0,
                },
              },
            },
          })}
        >
          {collections
            .sort((a, b) => a.order - b.order)
            .map((collection) => (
              <CollectionFolder
                key={collection.id}
                collection={collection}
                isYourProfile={isYourProfile}
              />
            ))}
        </Accordion>
      )}
    </Box>
  );
}

export default CardCollections;
