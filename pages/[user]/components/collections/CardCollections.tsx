import {
  Accordion,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconCheck, IconPencil } from "@tabler/icons-react";
import { useEffect, useState } from "react";
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
  cards,
}: {
  profile: UserData;
  cards: GameCard[];
}) {
  const qc = useQueryClient();
  const { t } = useTranslation("user");
  const { user, userDB } = useUser();
  const { collections: profileCollections, areCollectionsLoading } =
    useCollections();

  const [collections, collectionHandlers] =
    useListState<CardCollection>(profileCollections);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingCollections, editingHandlers] = useListState<CardCollection>();

  const [tempCollectionsWhileReordering, tempHandlersWhileReordering] =
    useListState<CardCollection>([]);
  const [isReordering, setIsReordering] = useState<boolean>(false);

  const isYourProfile = userDB?.suid === profile.suid;
  const [currentCollection, setCurrentCollection] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    if (!areCollectionsLoading && profileCollections)
      collectionHandlers.setState(profileCollections);
  }, [profileCollections, areCollectionsLoading, collectionHandlers]);

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
              `users/${user.id}/card_collections`,
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
            `users/${user.id}/card_collections`,
            originalCollection.id
          );
          batch.delete(collectionRef);
        }
      });

      if (toUpdateCollections.length > 0) {
        toUpdateCollections.forEach((collectionToCreate) => {
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
    },
  });

  const addNewCollection = async () => {
    if (!user?.id || !userDB) return;
    const newCollection = createNewCollectionObject({
      order: collections.length,
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
                editingHandlers.setState(collections);
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
              {areCollectionsLoading && (
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
