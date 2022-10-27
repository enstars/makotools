import { CollectedCard } from "../../types/makotools";

import { ID } from "types/game";

function addCard(
  originalCollection: CollectedCard[],
  id: ID,
  count: number = 0
): CollectedCard[] {
  const collection = originalCollection;
  let collectionItem = collection.find((c) => c.id === id);
  if (!collectionItem) {
    collection.push({ id, count });
    collectionItem = collection.find((c) => c.id === id);
  } else {
    const i = collection.indexOf(collectionItem);
    collectionItem = {
      ...collectionItem,
      count: collectionItem.count + count,
    };
    collection[i] = collectionItem;
  }
  return collection;
}

export { addCard };
