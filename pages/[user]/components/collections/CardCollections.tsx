import {
  Accordion,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconCheck, IconPencil } from "@tabler/icons-react";
import { useState } from "react";
import { useListState } from "@mantine/hooks";
import { doc, getFirestore, writeBatch } from "firebase/firestore";
import { isEqual } from "lodash";
import useTranslation from "next-translate/useTranslation";

import EditCollections from "./EditCollections";
import CollectionFolder from "./CollectionFolder";

import { CardCollection, UserData } from "types/makotools";
import { GameCard } from "types/game";
import useUser from "services/firebase/user";
import {
  createNewCollectionObject,
  useCollections,
} from "services/makotools/collection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cardCollectionQueries } from "services/queries";
import { showNotification } from "@mantine/notifications";

function CardCollections({
  profile,
  profileUID,
  cards,
}: {
  profile: UserData;
  profileUID: string;
  cards: GameCard[];
}) {
  const qc = useQueryClient();
  const { t } = useTranslation("user");
  const { user, userDB } = useUser();
  const { collections, areCollectionsLoading } = useCollections(profileUID);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingCollections, editingHandlers] = useListState<CardCollection>();

  const [tempCollectionsWhileReordering, tempHandlersWhileReordering] =
    useListState<CardCollection>([]);
  const [isReordering, setIsReordering] = useState<boolean>(false);

  const isYourProfile = userDB?.suid === profile.suid;
  const [currentCollection, setCurrentCollection] = useState<
    number | undefined
  >(undefined);

  const reorderCollection = useMutation({
    mutationFn: async () => {
      if (!user?.id || !userDB) throw new Error("User is not logged in");
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
          `users/${user.id}/card_collections`,
          collection.id
        );
        batch.update(collectionRef, { order: index });
      });

      // Commit the batch
      await batch.commit();
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: cardCollectionQueries.fetchCardCollections(
          user?.id ?? undefined
        ),
      });
    },
    onError: (error: Error) => {
      console.error("Could not save collections", error.message);
    },
  });

  const saveAllCollections = useMutation({
    mutationFn: async () => {
      if (!user?.id || !userDB) throw new Error("User is not logged in");
      const currentCollections = collections ?? [];
      setEditMode(false);
      setCurrentCollection(undefined);

      const db = getFirestore();

      // Get a new write batch
      const batch = writeBatch(db);

      const collectionsToUpdate: CardCollection[] = [...editingCollections];
      const updatedCollections: CardCollection[] = [];
      // for each collection in the db
      currentCollections.forEach((originalCollection) => {
        const existingCollection = collectionsToUpdate.find(
          (collectionToUpdate) =>
            collectionToUpdate.id === originalCollection.id
        );

        if (existingCollection) {
          // if the updated collection is different from the currently saved collection
          if (!isEqual(originalCollection, existingCollection)) {
            const collectionRef = doc(
              db,
              `users/${user.id}/card_collections`,
              existingCollection.id
            );
            batch.set(collectionRef, existingCollection, {
              merge: true,
            });
          }

          collectionsToUpdate.splice(
            collectionsToUpdate.indexOf(existingCollection),
            1
          );
          updatedCollections.push(existingCollection);
        } else {
          // otherwise delete the exisitng reference in the database
          if (collections?.length) {
            const collectionRef = doc(
              db,
              `users/${user.id}/card_collections`,
              originalCollection.id
            );
            batch.delete(collectionRef);
          }
        }
      });

      // only new collections are in this array at this point
      if (collectionsToUpdate.length > 0) {
        collectionsToUpdate.forEach((collectionToCreate) => {
          const collectionRef = doc(
            db,
            `users/${user.id}/card_collections`,
            collectionToCreate.id
          );
          batch.set(collectionRef, collectionToCreate, {
            merge: true,
          });
          updatedCollections.push(collectionToCreate);
        });
      }
      await batch.commit();
    },
    onSuccess: async () => {
      await qc.refetchQueries({
        queryKey: cardCollectionQueries.fetchCardCollections(
          user?.id ?? undefined
        ),
      });
      showNotification({
        id: "saveAllCollections",
        loading: false,
        title: "Success!",
        message: "Successfully saved collections",
        icon: <IconCheck />,
        color: "lime",
      });
      editingHandlers.setState([]);
    },
    onError: (error: Error) => {
      console.error("Could not save all collections", error.message);
      showNotification({
        id: "saveAllCollections",
        loading: false,
        title: "An error occurred",
        message: `Could not save all collections: ${error.message}`,
        icon: <IconAlertCircle />,
        color: "red",
      });
      editingHandlers.setState([]);
    },
  });

  const addNewCollection = async () => {
    if (!user?.id || !userDB) return;
    const newCollection = createNewCollectionObject({
      order: collections?.length ?? 0,
    });
    setCurrentCollection(editingCollections.length);
    editingHandlers.append(newCollection);
  };

  const discardAllChanges = () => {
    setEditMode(false);
    setCurrentCollection(undefined);
  };

  return (
    <Box>
      <Group position="apart">
        <Title order={2} mt="md" mb="xs">
          {t("collections.title")}
        </Title>
        {isYourProfile &&
          !editMode &&
          !areCollectionsLoading &&
          !saveAllCollections.isPending && (
            <Button
              variant="subtle"
              leftIcon={<IconPencil size={16} />}
              onClick={() => {
                setEditMode(true);
                editingHandlers.setState(collections ?? []);
              }}
            >
              {t("edit")}
            </Button>
          )}
      </Group>
      {areCollectionsLoading || saveAllCollections.isPending ? (
        <Box>
          <Center>
            <Stack>
              <Loader />
              {areCollectionsLoading && !saveAllCollections.isPending && (
                <Text fz="sm" color="dimmed">
                  Loading
                </Text>
              )}
              {saveAllCollections.isPending && (
                <Text fz="sm" color="dimmed">
                  Saving collections...
                </Text>
              )}
            </Stack>
          </Center>
        </Box>
      ) : editMode ? (
        <EditCollections
          {...{
            addNewCollection,
            cards,
            currentCollection,
            discardAllChanges,
            editingCollections,
            editingHandlers,
            isReordering,
            profile,
            setCurrentCollection,
            setIsReordering,
            tempCollectionsWhileReordering,
            tempHandlersWhileReordering,
          }}
          saveReorder={reorderCollection}
          saveAllChanges={saveAllCollections}
        />
      ) : collections?.length ? (
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
      ) : (
        <Paper mt="sm" p="sm" withBorder>
          {isYourProfile ? (
            <Text color="dimmed">
              You have no collections. Click the Edit button to create your
              first collection.
            </Text>
          ) : (
            <Text color="dimmed">This user has no available collections.</Text>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default CardCollections;
