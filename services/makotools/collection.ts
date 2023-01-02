import { clamp, remove } from "lodash";

import { CardCollection } from "types/makotools";
import { ID } from "types/game";
import { MAX_CARD_COPIES } from "services/game";

export const MAX_COLLECTION_NAME_LENGTH = 50;

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
