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
  UserCredential,
} from "firebase/auth";

import { setFirestoreUserData } from "./firestore";

const parseKey = (key: string) => {
  return key?.replace(/\\n/g, "\n")?.replace(/'/g, "");
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
    firebaseAdminInitConfig: {
      credential: {
        projectId: "ensemble-square",
        clientEmail:
          "firebase-adminsdk-ftvei@ensemble-square.iam.gserviceaccount.com",
        // The private key must not be accessible on the client side.
        privateKey: parseKey(process.env.FIREBASE_PRIVATE_KEY || ""),
      },
      databaseURL: "",
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
    tokenChangedHandler: async (authUser) => {
      const { loginAPIEndpoint, logoutAPIEndpoint } = {
        loginAPIEndpoint: "/api/login", // required
        logoutAPIEndpoint: "/api/logout", // required
      };
      let response;
      // If the user is authed, call login to set a cookie.
      if (authUser.id) {
        const userToken = (await authUser.getIdToken()) || "";
        response = await fetch(loginAPIEndpoint, {
          method: "POST",
          headers: [["Authorization", userToken]],
          credentials: "include",
        });
        if (!response.ok) {
          const responseJSON = await response.json();
          throw new Error(
            `Received ${
              response.status
            } response from login API endpoint: ${JSON.stringify(responseJSON)}`
          );
        }
      } else {
        // If the user is not authed, call logout to unset the cookie.
        response = await fetch(logoutAPIEndpoint, {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) {
          const responseJSON = await response.json();
          throw new Error(
            `Received ${
              response.status
            } response from logout API endpoint: ${JSON.stringify(
              responseJSON
            )}`
          );
        }
      }
      return response;
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
  email: string,
  password: string,
  callback = (a: any) => {}
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
  email: string,
  password: string,
  data: null | {},
  callback: (res: UserCredential | any) => void
) => {
  {
    const clientAuth = getAuth();
    createUserWithEmailAndPassword(clientAuth, email, password)
      .then((result) => {
        callback(result);
      })
      .catch((error) => {
        callback({ status: "error", error });
      });
  }
};
