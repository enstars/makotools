import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { validateUsernameDb } from "services/firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const username = req.body.username;
    const isUsernameValid = await validateUsernameDb(username);
    if (!isUsernameValid)
      throw new TypeError("Could not find user with this username");
    const db = getFirestore();
    const usernameQuery = query(
      collection(db, "users"),
      where("username", "==", username)
    );
    const querySnap = await getDocs(usernameQuery);
    const userData = querySnap.docs[0];
    const userEmail = userData.data().email;
    res.status(200).send({ userEmail });
  } catch (error) {
    res.status(500).send(error);
  }
}
