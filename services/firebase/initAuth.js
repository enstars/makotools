// ./initAuth.js
import { init } from "next-firebase-auth";

const parseKey = (key) => {
  return key?.replace(/\\n/g, "\n") || undefined;
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
    // firebaseAuthEmulatorHost: "localhost:9099",
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
      //   databaseURL: "https://my-example-app.firebaseio.com",
    },
    // Use application default credentials (takes precedence over firebaseAdminInitConfig if set)
    // useFirebaseAdminDefaultCredential: true,
    firebaseClientInitConfig: {
      apiKey: "AIzaSyA530zKJVq_vi56gzta4J_jGWIxgCIJg2k",
      authDomain: "ensemble-square.firebaseapp.com",
      //   databaseURL: "https://my-example-app.firebaseio.com",
      projectId: "ensemble-square",
    },
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
      signed: true,
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
