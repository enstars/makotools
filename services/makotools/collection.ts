import { clamp, remove } from "lodash";

import { CardCollection } from "types/makotools";
import { ID } from "types/game";
import { MAX_CARD_COPIES } from "services/game";
import { generateUUID } from "services/utilities";

export const MAX_COLLECTION_NAME_LENGTH = 50;

export const COLLECTION_PRIVACY_LEVEL_DESCRIPTION = {
  "0": "Public to everyone",
  "1": "Visible to logged in users",
  "2": "Visible only to friends",
  "3": "Completely private",
};

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
