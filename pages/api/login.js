// ./pages/api/login
import {
  setAuthCookies,
  verifyIdToken,
  getFirebaseAdmin,
} from "next-firebase-auth";
import initAuth, {
  syncFirestoreUserData,
} from "../../services/firebase/authentication"; // the module you created above
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initAuth();

const handler = async (req, res) => {
  try {
    await setAuthCookies(req, res);
    const authToken = req.headers.authorization;
    const authUser = await verifyIdToken(authToken);
    console.log(authUser);
    // console.log(defaultFirestore);
    // initAuth();
    const db = getFirebaseAdmin().firestore();
    const docRef = db.collection("users").doc(authUser.id);
    const docSet = await docRef.set(
      {
        email: authUser.email,
        lastLogin: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    // const docGet = (await docRef.get())?.data();
    // console.log(docGet);

    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
