import { getFirebaseAdmin } from "next-firebase-auth";
import { NextApiRequest, NextApiResponse } from "next";

import { initAuthentication } from "services/firebase/authentication";
import { generateUUID } from "services/utilities";

initAuthentication();

const migrateCollection = async (userUID: string, existingCollection: any) => {
  const db = getFirebaseAdmin().firestore();

  if (userUID === undefined || existingCollection === undefined) {
    throw new Error("Bad request");
  }

  const newCollection = await db
    .collection(`users/${userUID}/card_collections`)
    .add({
      id: generateUUID(),
      name: "Collection",
      icon: 0,
      privacyLevel: 0,
      default: true,
      cards: existingCollection || [],
      order: 0,
    });

  await db.collection("users").doc(userUID).set(
    {
      migrated: true,
    },
    { merge: true }
  );

  return newCollection;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userUID = req.body.userUID;
    // get existingCollection from req body
    const existingCollection = req.body.existingCollection;

    const newCollection = await migrateCollection(userUID, existingCollection);

    // await docRef.set({}, { merge: true });

    return res.status(200).json({ success: true, id: newCollection.id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
export { migrateCollection };
