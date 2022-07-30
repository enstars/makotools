// ./initAuth.js
import { init } from "next-firebase-auth";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { setFirestoreUserData } from "./firestore";

const parseKey = (key) => {
  return key?.replace(/\\n/g, "\n")?.replace(/'/g, "") || undefined;
};

// Config & Initialization
const firebaseConfig = {
  apiKey: "AIzaSyA530zKJVq_vi56gzta4J_jGWIxgCIJg2k",
  authDomain: "ensemble-square.web.app",
  projectId: "ensemble-square",
  storageBucket: "ensemble-square.appspot.com",
  messagingSenderId: "940403567905",
  appId: "1:940403567905:web:51d666cacd10e979cb2260",
  measurementId: "G-L1FLXJKQC5",
};

const initAuth = () => {
  init({
    authPageURL: "/login",
    appPageURL: "/",
    loginAPIEndpoint: "/api/login", // required
    logoutAPIEndpoint: "/api/logout", // required
    onLoginRequestError: (err) => {
      console.error(err);
    },
    onLogoutRequestError: (err) => {
      console.error(err);
    },
    firebaseAdminInitConfig: {
      credential: {
        projectId: "ensemble-square",
        clientEmail:
          "firebase-adminsdk-ftvei@ensemble-square.iam.gserviceaccount.com",
        // The private key must not be accessible on the client side.
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? parseKey(process.env.FIREBASE_PRIVATE_KEY)
          : undefined,
      },
    },
    // Use application default credentials (takes precedence over firebaseAdminInitConfig if set)
    // useFirebaseAdminDefaultCredential: true,
    firebaseClientInitConfig: firebaseConfig,
    cookies: {
      name: "MakoTools", // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "development" ? false : true, // set this to false in local (non-HTTPS) development
      signed: false,
    },
    onVerifyTokenError: (err) => {
      console.error(err);
    },
    onTokenRefreshError: (err) => {
      console.error(err);
    },
  });
};

export default initAuth;

export const appSignInWithGoogle = () => {
  const clientAuth = getAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  signInWithPopup(clientAuth, provider);
};
export const appSignInWithTwitter = (errorCallback = console.log) => {
  const clientAuth = getAuth();
  const provider = new TwitterAuthProvider();
  provider.setCustomParameters({ force_login: "true" });
  // provider.setCustomParameters({ lang: "th" });
  signInWithPopup(clientAuth, provider).catch(errorCallback);
};

export const appSignInWithEmailAndPassword = (
  email,
  password,
  callback = () => {}
) => {
  const clientAuth = getAuth();
  signInWithEmailAndPassword(clientAuth, email, password)
    .then((result) => {
      //   syncFirestoreUserData(result.user);
    })
    .catch((error) => {
      callback({ status: "error", error });
    });
};
export const appSignUpWithEmailAndPassword = (
  email,
  password,
  userInfo,
  callback = () => {}
) => {
  {
    const clientAuth = getAuth();
    createUserWithEmailAndPassword(clientAuth, email, password)
      .then((result) => {
        setFirestoreUserData(userInfo, result.user.uid);
      })
      .catch((error) => {
        callback({ status: "error", error });
      });
  }
};
