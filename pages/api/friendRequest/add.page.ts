import { verifyIdToken, getFirebaseAdmin } from "next-firebase-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { FieldValue } from "firebase-admin/firestore";

import { initAuthentication } from "services/firebase/authentication";

initAuthentication();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) throw Error("Unauthorized");

    const authUser = await verifyIdToken(authToken);
    if (!authUser.id) throw Error("Token incorrect");

    const friendUID = req.body.friend;
    if (!friendUID) throw Error("Friend not provided");

    const db = getFirebaseAdmin().firestore();
    const docCollection = db.collection(`users/${authUser.id}/private`);
    const docRef = docCollection.doc("values");
    const docGet = (await docRef.get())?.data();

    const friendDocCollection = db.collection(`users/${friendUID}/private`);
    const friendDocRef = friendDocCollection.doc("values");
    const friendDocGet = (await friendDocRef.get())?.data();

    if (!(await db.collection("users").doc(friendUID).get()).data())
      throw Error("Friend error");

    if (friendDocGet?.friends__receivedRequests.includes(authUser.id))
      throw Error("Duplicate request");

    await docRef.set(
      {
        friends__sentRequests: FieldValue.arrayUnion(friendUID),
      },
      { merge: true }
    );

    await friendDocRef.set(
      {
        friends__receivedRequests: FieldValue.arrayUnion(authUser.id),
      },
      { merge: true }
    );

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
