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
import { IconPencil } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useListState } from "@mantine/hooks";
import useSWR from "swr";
import { doc, getFirestore, writeBatch } from "firebase/firestore";
import { isEqual } from "lodash";

import EditCollections from "./EditCollections";
import CollectionFolder from "./CollectionFolder";

import { CardCollection, UserData } from "types/makotools";
import { getFirestoreUserCollection } from "services/firebase/firestore";
import { GameCard, GameUnit } from "types/game";
import useUser from "services/firebase/user";
import { createNewCollectionObject } from "services/makotools/collection";

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
    const newCollection = createNewCollectionObject({
      order: collections.length,
    });
    setCurrentCollection(editingCollections.length);
    editingHandlers.append(newCollection);
  };

  const saveAllChanges = async () => {
    if (!user.loggedIn) return;
    setEditMode(false);
    setCurrentCollection(undefined);

    const db = getFirestore();

    // Get a new write batch
    const batch = writeBatch(db);

    const toUpdateCollections: CardCollection[] = [...editingCollections];
    const updatedCollections: CardCollection[] = [];
    collections.forEach((originalCollection) => {
      const newCollection = toUpdateCollections.find(
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

        toUpdateCollections.splice(
          toUpdateCollections.indexOf(newCollection),
          1
        );
        updatedCollections.push(newCollection);
      } else {
        const collectionRef = doc(
          db,
          `users/${user.user.id}/card_collections`,
          originalCollection.id
        );
        batch.delete(collectionRef);
      }
    });

    if (toUpdateCollections.length > 0) {
      toUpdateCollections.forEach((collectionToCreate) => {
        const collectionRef = doc(
          db,
          `users/${user.user.id}/card_collections`,
          collectionToCreate.id
        );
        batch.set(collectionRef, collectionToCreate, {
          merge: true,
        });
        updatedCollections.push(collectionToCreate);
      });
    }
    await batch.commit();

    mutate(updatedCollections);
  };

  const discardAllChanges = () => {
    setEditMode(false);
    setCurrentCollection(undefined);
  };

  return (
    <Box>
      <Group position="apart">
        <Title order={2} mt="md" mb="xs">
          Collections
        </Title>
        {isYourProfile && !editMode && (
          <Button
            variant="subtle"
            leftIcon={<IconPencil size={16} />}
            onClick={() => {
              setEditMode(true);
              editingHandlers.setState(collections);
            }}
          >
            Edit
          </Button>
        )}
      </Group>
      {isLoading && !editMode ? (
        <Box>
          <Center>
            <Loader />
          </Center>
        </Box>
      ) : editMode ? (
        <EditCollections
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
          saveReorder={saveReorder}
          saveAllChanges={saveAllChanges}
          discardAllChanges={discardAllChanges}
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
