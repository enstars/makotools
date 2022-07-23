import { getFirebaseAdmin, withAuthUserTokenSSR } from "next-firebase-auth";

export default function getServerSideUser(f) {
  return withAuthUserTokenSSR({
    // whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  })(async ({ AuthUser, ...props }) => {
    console.log(AuthUser);
    if (AuthUser.id) {
      const db = getFirebaseAdmin().firestore();
      const docRef = db.collection("users").doc(AuthUser.id);
      const firestore = await (await docRef.get()).data();
      return f({ user: AuthUser, firestore, ...props });
    }
    return f({ user: AuthUser, firestore: {}, ...props });
  });
}
