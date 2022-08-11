import { getFirebaseAdmin, withAuthUserTokenSSR } from "next-firebase-auth";

export default function getServerSideUser(serverSideFunction, firebaseConfig) {
  if (typeof window === "undefined") {
    return withAuthUserTokenSSR({
      // whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
      ...firebaseConfig,
    })(async ({ AuthUser, ...context }) => {
      const user = AuthUser;
      const admin = getFirebaseAdmin();

      context.res.setHeader(
        "Cache-Control",
        "public, s-maxage=7200, stale-while-revalidate=172800"
      );
      // refresh every 2 hours, stale for 48hrs

      const firebaseContext = {
        ...context,
        user,
        admin,
      };

      if (AuthUser.id) {
        // user is logged in
        const db = admin.firestore();
        const docRef = db.collection("users").doc(AuthUser.id);
        const firestore = await (await docRef.get()).data();
        firebaseContext.firestore = firestore;
      }

      const renderData = serverSideFunction
        ? await serverSideFunction({ ...context, ...firebaseContext })
        : { props: {} };
      if (renderData.notFound) return renderData;
      renderData.props.__user = JSON.stringify(firebaseContext.user);
      renderData.props.__firestore = JSON.stringify(firebaseContext.firestore);

      return renderData;
    });
  }
  return serverSideFunction;
}
