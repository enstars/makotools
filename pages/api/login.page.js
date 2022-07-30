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

const genRanHex = (size) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("")
    .toUpperCase();

async function validateSUID(docCollection, suid) {
  const querySnap = await docCollection.where("suid", "==", suid).get();
  const suidValid = !querySnap.size;
  return suidValid;
}

const handler = async (req, res) => {
  try {
    await setAuthCookies(req, res);
    const authToken = req.headers.authorization;
    const authUser = await verifyIdToken(authToken);
    console.log(authUser);
    // console.log(defaultFirestore);
    // initAuth();
    const db = getFirebaseAdmin().firestore();
    const docCollection = db.collection("users");
    const docRef = docCollection.doc(authUser.id);
    const docSet = await docRef.set(
      {
        email: authUser.email,
        lastLogin: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    const docGet = (await docRef.get())?.data();
    let suid = docGet?.suid;
    if (!suid) {
      let uniqueSUID = "";
      while (!uniqueSUID) {
        uniqueSUID = genRanHex(6);
        if (validateSUID(docCollection, uniqueSUID)) {
          const docSetSUID = await docRef.set(
            {
              suid: uniqueSUID,
            },
            { merge: true }
          );
          suid = uniqueSUID;
        } else {
          uniqueSUID = "";
        }
      }
    }
    if (!docGet?.joinDate) {
      const docSetJoinDate = await docRef.set(
        {
          joinDate: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    console.log(docGet);

    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
