import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import "firebase/compat/auth";

// Config & Initialization
const firebaseConfig = {
  apiKey: "AIzaSyA530zKJVq_vi56gzta4J_jGWIxgCIJg2k",
  authDomain: "ensemble-square.firebaseapp.com",
  projectId: "ensemble-square",
  storageBucket: "ensemble-square.appspot.com",
  messagingSenderId: "940403567905",
  appId: "1:940403567905:web:51d666cacd10e979cb2260",
  measurementId: "G-L1FLXJKQC5",
};
const firebaseApp = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const appSignInWithGoogle = () => signInWithRedirect(auth, provider);
export const appSignOut = () => signOut(auth);
export const appSignInWithEmailAndPassword = (
  email,
  password,
  callback = () => {}
) =>
  signInWithEmailAndPassword(auth, email, password)
    .then((result) => syncFirestoreUserData(result.user))
    .catch((error) => {
      callback({ status: "error", error });
    });
export const appSignUpWithEmailAndPassword = (
  email,
  password,
  userInfo,
  callback = () => {}
) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((result) => {
      syncFirestoreUserData(result.user, callback, userInfo);
      console.log(0);
    })
    .catch((error) => {
      // console.log(callback);
      callback({ status: "error", error });
    });
};

// Firestore Database
const db = getFirestore();

getRedirectResult(auth)
  .then((result) => {
    if (result) {
      const { user } = result;
      // console.log(user);
      syncFirestoreUserData(user);
    }
  })
  .catch((e) => {
    console.error(e);
  });

function syncFirestoreUserData(user, callback = () => {}, userInfo = {}) {
  // console.log(user);
  setFirestoreUserData(
    {
      ...userInfo,
      // googleUser: JSON.stringify(user),
      user: JSON.stringify(user),
      // i actually have no idea if this is safe. but this should be only public info so
      lastLogin: serverTimestamp(),
    },
    user.uid
  );
}

function setFirestoreUserData(data, uid = auth.currentUser.uid) {
  setDoc(doc(db, "users", uid), data, { merge: true });
}

async function getFirestoreUserData(uid = auth.currentUser.uid) {
  const docSnap = await getDoc(doc(db, "users", uid));

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data;
  }
  return null;
}

async function validateUsernameDb(username) {
  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnap = await getDocs(q);
  const usernameValid = !!!querySnap.size;
  return usernameValid;
}

export { setFirestoreUserData, getFirestoreUserData, validateUsernameDb };
