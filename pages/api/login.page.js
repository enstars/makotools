// ./pages/api/login
import {
  setAuthCookies,
  verifyIdToken,
  getFirebaseAdmin,
} from "next-firebase-auth";

import { FieldValue, getFirestore } from "firebase-admin/firestore";

import initAuth from "../../services/firebase/authentication"; // the module you created above

const firestoreSettings = { ignoreUndefinedProperties: true };

// const defaultFirestore = getFirestore();
// defaultFirestore.settings({ ignoreUndefinedProperties: true });

initAuth();

// getFirebaseAdmin().firestore().settings({ ignoreUndefinedProperties: true });

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
    // db.settings(firestoreSettings); // no idea why this doesnt work
    const docCollection = db.collection("users");
    const docRef = docCollection.doc(authUser.id);
    const docGet = (await docRef.get())?.data();

    let suid = docGet?.suid;
    if (!suid) {
      let uniqueSUID = "";
      while (!uniqueSUID) {
        uniqueSUID = genRanHex(6);
        if (validateSUID(docCollection, uniqueSUID)) {
          suid = uniqueSUID;
        } else {
          uniqueSUID = "";
        }
      }
    }
    let username = docGet?.username || suid;
    if (!docGet?.joinDate) {
      const docSetJoinDate = await docRef.set(
        {
          joinDate: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    const docSet = await docRef.set(
      {
        email: authUser?.email || null,
        lastLogin: FieldValue.serverTimestamp(),
        suid,
        username,
      },
      { merge: true }
    );

    // console.log(docGet);

    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
};

export default handler;
