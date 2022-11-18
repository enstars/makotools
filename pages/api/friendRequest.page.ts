import { verifyIdToken, getFirebaseAdmin } from "next-firebase-auth";
import { NextApiRequest, NextApiResponse } from "next";

import { initAuthentication } from "../../services/firebase/authentication";

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
    const docCollection = db.collection("users");
    const docRef = docCollection.doc(authUser.id);
    const docGet = (await docRef.get())?.data();
    const friendDocRef = docCollection.doc(friendUID);
    const friendDocGet = (await friendDocRef.get())?.data();

    if (!friendDocGet) throw Error("Friend error");

    const currentSentRequests = docGet?.friends__sentRequests || [];
    currentSentRequests.push(friendUID);
    await docRef.set(
      {
        friends__sentRequests: currentSentRequests,
      },
      { merge: true }
    );

    const currentfriendReceivedRequests =
      friendDocGet?.friends__receivedRequests || [];
    currentfriendReceivedRequests.push(authUser.id);
    await friendDocRef.set(
      {
        friends__receivedRequests: currentfriendReceivedRequests,
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
