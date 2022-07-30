import { getFirebaseAdmin, withAuthUserTokenSSR } from "next-firebase-auth";

export default function getServerSideUser(f, config) {
  return withAuthUserTokenSSR({
    // whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
    ...config,
  })(async ({ AuthUser, ...props }) => {
    if (!f) return { props: {} };
    console.log(AuthUser);
    const admin = getFirebaseAdmin();
    if (AuthUser.id) {
      const db = admin.firestore();
      const docRef = db.collection("users").doc(AuthUser.id);
      const firestore = await (await docRef.get()).data();
      return f({ user: AuthUser, firestore, admin, ...props });
    }
    return f({ user: AuthUser, firestore: {}, admin, ...props });
  });
}
