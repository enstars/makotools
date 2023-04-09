import {
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

import { parseStringify } from "services/utilities";
import {
  UserData,
  LoadingStatus,
  UserPrivateData,
  User,
  CardCollection,
} from "types/makotools";

/**
 * When querying documents using where(), a maximum of
 * 10 values can be passed to most operators
 * https://firebase.google.com/docs/firestore/query-data/queries#in_not-in_and_array-contains-any
 */
export const FIRESTORE_MAXIMUM_WHERE_VALUES = 10;

export function setFirestoreUserData(
  data: any,
  callback: (s: { status: LoadingStatus }) => void,
  priv = false
) {
  const clientAuth = getAuth();
  const db = getFirestore();
  if (clientAuth.currentUser === null) {
    callback({ status: "error" });
    return;
  }
  setDoc(
    doc(
      db,
      priv ? `users/${clientAuth.currentUser.uid}/private` : "users",
      priv ? "values" : clientAuth.currentUser.uid
    ),
    data,
    {
      merge: true,
    }
  ).then(
    () => {
      callback({ status: "success" });
    },
    () => {
      callback({ status: "error" });
    }
  );
}

export async function getFirestoreUserData(uid: string) {
  const clientAuth = getAuth();
  const db = getFirestore();

  if (clientAuth.currentUser === null) {
    return undefined;
  }
  const docSnap = await getDoc(
    doc(db, "users", uid || clientAuth?.currentUser?.uid)
  );

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data as UserData;
  }
  return undefined;
}
export async function getFirestorePrivateUserData(uid: string) {
  const clientAuth = getAuth();
  const db = getFirestore();

  if (clientAuth.currentUser === null) {
    return undefined;
  }
  const docSnap = await getDoc(
    doc(db, `users/${uid || clientAuth?.currentUser?.uid}/private`, "values")
  );

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data as UserPrivateData;
  }
  return undefined;
}

export async function validateUsernameDb(username: string) {
  const db = getFirestore();
  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnap = await getDocs(q);
  const usernameValid = !!!querySnap.size;
  return usernameValid;
}

export async function sendVerificationEmail() {
  const clientAuth = getAuth();

  if (
    clientAuth.currentUser !== null &&
    !clientAuth.currentUser.emailVerified
  ) {
    sendEmailVerification(clientAuth.currentUser);
  }
}

export async function sendPasswordReset(
  email: string,
  setEmailSent: Dispatch<SetStateAction<boolean>>
) {
  const clientAuth = getAuth();
  await sendPasswordResetEmail(clientAuth, email);
  setEmailSent(true);
}

export async function getFirestoreUserCollection([collectionAddress, user]: [
  string,
  User
]) {
  const db = getFirestore();

  const profileUID = collectionAddress.split("/")[1];
  const accessiblePrivacyLevel = user.loggedIn
    ? user.user.id === profileUID
      ? 3
      : user.privateDb.friends__list?.includes(profileUID)
      ? 2
      : 1
    : 0;

  let querySnap,
    userCollection: CardCollection[] = [];
  try {
    querySnap = await getDocs(
      query(
        collection(db, collectionAddress),
        where("privacyLevel", "<=", accessiblePrivacyLevel)
      )
    );

    querySnap.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data();
      data.id = doc.id;
      userCollection.push(data as CardCollection);
    });
  } catch (e) {
    console.error(e);
  }
  return userCollection;
}

export async function getFirestoreUserDocument(
  collection: string,
  document: string,
  fallback?: any,
  customUid?: string
) {
  const clientAuth = getAuth();
  const db = getFirestore();

  if (clientAuth.currentUser === null) {
    return undefined;
  }
  const uid = customUid || clientAuth.currentUser.uid;
  const docSnap = await getDoc(doc(db, `users/${uid}/${collection}`, document));

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data as UserData;
  }
  if (typeof fallback !== undefined) return fallback;
  throw new Error("nonexistent and no fallback");
  return undefined;
}

// export async function getFirestoreUserProfile([profileAddress, user]: [
//   string,
//   User
// ]) {
//   const db = getFirestore();
//   let profile;

//   try {
//     const q: any = query(
//       collection(db, "users"),
//       where("username", "==", (user as UserLoggedIn).db.username)
//     );
//     const querySnap = await getDocs(q);
//     profile = parseStringify(querySnap.docs[0].data());

//     return profile;
//   } catch (e) {
//     console.error(e);
//   }

//   return profile;
// }
export async function getFirestoreUserProfile([profileAddress, uid]: [
  string,
  string
]) {
  const db = getFirestore();
  let profile;

  try {
    const docSnap = await getDoc(doc(db, `users`, uid));
    profile = parseStringify(docSnap.data());

    return profile;
  } catch (e) {
    console.error(e);
  }

  return profile;
}
