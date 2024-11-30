import { clamp, remove } from "lodash";
import { doc, getFirestore, setDoc } from "firebase/firestore";

import { CardCollection } from "types/makotools";
import { ID } from "types/game";
import { MAX_CARD_COPIES } from "services/game";
import { generateUUID, getTimestamp } from "services/utilities";
import useUser from "services/firebase/user";
import { getFirestoreUserCollection } from "services/firebase/firestore";
import { useDayjs } from "services/libraries/dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cardCollectionQueries } from "services/queries";

export const MAX_COLLECTION_NAME_LENGTH = 50;

export function editCardInCollection({
  collection,
  id,
  count,
  dateAdded,
}: {
  collection: CardCollection;
  id: ID;
  count: number;
  dateAdded?: string;
}): CardCollection {
  count = clamp(count, 0, MAX_CARD_COPIES);

  // Remove card from collection
  if (count === 0) {
    remove(collection.cards, { id });
    return collection;
  }

  let collectionItem = collection.cards.find((c) => c.id === id);

  if (!collectionItem) {
    collection.cards.push({
      id,
      count: count || 1,
      dateAdded,
    });
    return collection;
  }

  const i = collection.cards.indexOf(collectionItem);
  collectionItem = {
    ...collectionItem,
    count,
  };
  collection.cards[i] = collectionItem;
  return collection;
}

export function createNewCollectionObject({
  name,
  order,
  privacyLevel,
  icon,
}: Partial<
  Pick<CardCollection, "name" | "order" | "privacyLevel" | "icon">
>): CardCollection {
  return {
    id: generateUUID(),
    name: name
      ? name.substring(0, MAX_COLLECTION_NAME_LENGTH)
      : `Untitled Collection`,
    icon: icon || 0,
    privacyLevel: privacyLevel || 1,
    cards: [],
    order: order || 0,
  };
}

export function useCollections() {
  const { user, userDB, privateUserDB } = useUser();
  const { dayjs } = useDayjs();
  const qc = useQueryClient();

  const userId = user?.id;

  const { data: collections, isPending: areCollectionsLoading } = useQuery({
    queryKey: cardCollectionQueries.fetchCardCollections(userId ?? undefined),
    enabled: !!userDB && !!userId,
    queryFn: async ({ queryKey }) => {
      const uid = queryKey[1];
      try {
        return await getFirestoreUserCollection(
          user,
          userDB,
          uid,
          privateUserDB
        );
      } catch {
        throw new Error("Could not retrieve user collections");
      }
    },
  });

  const editCollection = useMutation({
    mutationFn: async ({
      collectionId,
      cardId,
      numCopies,
    }: {
      collectionId: string | number;
      cardId: number;
      numCopies: number;
    }) => {
      if (!user || !userDB) throw new Error("User not logged in");
      if (!userId) throw new Error("User ID is undefined");
      const collectionToUpdate = collections!.find(
        (collection) => collection.id === collectionId
      );
      const newCollection = { ...collectionToUpdate! };
      const now = getTimestamp(dayjs());
      editCardInCollection({
        collection: newCollection,
        id: cardId,
        count: numCopies,
        dateAdded: now,
      });
      const db = getFirestore();
      await setDoc(
        doc(db, `users/${userId}/card_collections/${newCollection.id}`),
        newCollection,
        { merge: true }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: cardCollectionQueries.fetchCardCollections(
          userId ?? undefined
        ),
      });
    },
    onError: (error: Error) => {
      console.error("Could not edit collection", error.message);
    },
  });

  const createCollection = useMutation({
    mutationFn: async ({
      name,
      privacyLevel,
      icon,
    }: {
      name: string;
      privacyLevel: 0 | 1 | 2 | 3;
      icon: number;
    }) => {
      if (!user || !userDB) throw new Error("User not logged in");
      const newCollection = createNewCollectionObject({
        name,
        order: collections!.length,
        privacyLevel,
        icon,
      });
      const db = getFirestore();
      await setDoc(
        doc(db, `users/${user.id}/card_collections/${newCollection.id}`),
        newCollection
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: cardCollectionQueries.fetchCardCollections(
          userId ?? undefined
        ),
      });
    },
    onError: (error: Error) => {
      console.error("Could not create a new collection", error.message);
    },
  });

  return {
    collections,
    areCollectionsLoading,
    editCollection,
    createCollection,
  };
}
