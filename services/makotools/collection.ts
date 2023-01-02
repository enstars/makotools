import { clamp, remove } from "lodash";
import useSWR from "swr";
import { doc, getFirestore, setDoc } from "firebase/firestore";

import { CardCollection, UserLoggedIn } from "types/makotools";
import { ID } from "types/game";
import { MAX_CARD_COPIES } from "services/game";
import { generateUUID } from "services/utilities";
import useUser from "services/firebase/user";
import { getFirestoreUserCollection } from "services/firebase/firestore";

export const MAX_COLLECTION_NAME_LENGTH = 50;

export const COLLECTION_PRIVACY_LEVEL_DESCRIPTION = [
  "Public to everyone",
  "Visible to logged in users",
  "Visible only to friends",
  "Completely private",
];

export function editCardInCollection(
  collection: CardCollection,
  id: ID,
  count: number
): CardCollection {
  count = clamp(count, 0, MAX_CARD_COPIES);

  // Remove card from collection
  if (count === 0) {
    remove(collection.cards, { id });
    return collection;
  }

  let collectionItem = collection.cards.find((c) => c.id === id);

  if (!collectionItem) {
    collection.cards.push({ id, count: count || 1 });
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
  const user = useUser();

  const {
    data: collections,
    isLoading: loadingCollections,
    mutate: mutateCollections,
  } = useSWR<CardCollection[]>(
    user.loggedIn ? [`users/${user.user.id}/card_collections`, user] : null,
    getFirestoreUserCollection
  );

  const onEditCollection = async ({
    collectionId,
    cardId,
    numCopies,
  }: {
    collectionId: CardCollection["id"];
    cardId: ID;
    numCopies: number;
  }) => {
    const collectionToUpdate = collections!.find(
      (collection) => collection.id === collectionId
    );
    const newCollection = { ...collectionToUpdate! };
    editCardInCollection(newCollection, cardId, numCopies);
    const db = getFirestore();
    await setDoc(
      doc(
        db,
        `users/${(user as UserLoggedIn).user.id}/card_collections/${
          newCollection.id
        }`
      ),
      newCollection,
      { merge: true }
    );
    mutateCollections();
  };

  const onNewCollection = async ({
    name,
    privacyLevel,
    icon,
  }: Pick<CardCollection, "name" | "privacyLevel" | "icon">) => {
    const newCollection = createNewCollectionObject({
      name,
      order: collections!.length,
      privacyLevel,
      icon,
    });
    const db = getFirestore();
    await setDoc(
      doc(
        db,
        `users/${(user as UserLoggedIn).user.id}/card_collections/${
          newCollection.id
        }`
      ),
      newCollection
    );
    mutateCollections();
  };

  return {
    collections,
    loadingCollections,
    mutateCollections,
    onEditCollection,
    onNewCollection,
  };
}
