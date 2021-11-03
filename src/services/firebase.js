import { initializeApp } from "firebase/app";
import {
    getAuth, signInWithRedirect, GoogleAuthProvider, signOut, getRedirectResult,
} from "firebase/auth";
import {
    getFirestore, doc, setDoc, serverTimestamp,
} from "firebase/firestore";

import "firebase/compat/auth";

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

// eslint-disable-next-line import/prefer-default-export
export const auth = getAuth(firebaseApp);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({ prompt: "select_account" });

export const appSignInWithGoogle = () => signInWithRedirect(auth, provider);
export const appSignOut = () => signOut(auth);

const db = getFirestore();

getRedirectResult(auth)
    .then((result) => {
        const { user } = result;
        console.log(user);

        setDoc(doc(db, "users", user.uid), {
            googleUser: JSON.stringify(user),
            // i actually have no idea if this is safe. but this should be only public info so
            lastLogin: serverTimestamp(),
        });
    }).catch((error) => {
        console.log(error);
    });
// export default firebase;
