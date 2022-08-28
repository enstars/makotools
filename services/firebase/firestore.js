import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  // serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function setFirestoreUserData(data, callback) {
  const clientAuth = getAuth();
  const db = getFirestore();
  setDoc(doc(db, "users", clientAuth?.currentUser?.uid), data, {
    merge: true,
  }).then(
    () => {
      callback({ status: "success" });
    },
    () => {
      callback({ status: "error" });
    }
  );
}

async function getFirestoreUserData(uid) {
  const clientAuth = getAuth();
  const db = getFirestore();
  const docSnap = await getDoc(
    doc(db, "users", uid || clientAuth?.currentUser?.uid)
  );

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data;
  }
  return null;
}

async function validateUsernameDb(username) {
  const db = getFirestore();
  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnap = await getDocs(q);
  const usernameValid = !!!querySnap.size;
  return usernameValid;
}

export { setFirestoreUserData, getFirestoreUserData, validateUsernameDb };
