import { getFirebaseAdmin } from "next-firebase-auth";
import { NextApiRequest, NextApiResponse } from "next";

import { initAuthentication } from "services/firebase/authentication";

initAuthentication();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // get user uid from body
    const userUID = req.body.userUID;
    // get existingCollection from req body
    const existingCollection = req.body.existingCollection;
    const db = getFirebaseAdmin().firestore();
    // const docGet = (await docRef.get())?.data();

    // if (docGet === undefined)
    //   return res.status(404).json({ error: "User not found" });

    if (userUID === undefined || existingCollection === undefined)
      return res.status(400).json({ error: "Bad request" });

    // if (docGet.migrated === true)
    //   return res.status(500).json({ success: true });

    const newCollection = await db
      .collection(`users/${userUID}/card_collections`)
      .add({
        name: "Collection",
        icon: 0,
        privacyLevel: 0,
        default: true,
        cards: existingCollection || [],
      });

    await db.collection("users").doc(userUID).set(
      {
        migrated: true,
      },
      { merge: true }
    );

    // await docRef.set({}, { merge: true });

    return res.status(200).json({ success: true, id: newCollection.id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
