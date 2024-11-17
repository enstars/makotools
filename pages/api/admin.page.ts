import { getFirebaseAdmin } from "next-firebase-auth";
import { NextApiRequest, NextApiResponse } from "next";

import { initAuthentication } from "services/firebase/authentication";

try {
  initAuthentication();
} catch (e) {
  console.error(`Could not authenticate: ${(e as Error).message}`);
}

// this bit of code i just quickly put together
// to transfer user data between accounts manually

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const db = getFirebaseAdmin().firestore();
    const docCollection = db.collection("users");
    const docRef = docCollection.doc("");
    const docGet = (await docRef.get())?.data();

    // await docRef.set({}, { merge: true });

    return res.status(200).json({ success: true, docGet });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
