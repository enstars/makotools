import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {
  AuthUser,
  AuthUserContext,
  getFirebaseAdmin,
  withAuthUserTokenSSR,
} from "next-firebase-auth";

import { GetServerSideUserContext } from "../../types/makotools";

export default function getServerSideUser(
  serverSideFunction: GetServerSideProps,
  firebaseConfig?: any
) {
  if (typeof window === "undefined") {
    return withAuthUserTokenSSR({
      ...firebaseConfig,
    })(
      async ({
        AuthUser,
        ...context
      }: GetServerSidePropsContext & { AuthUser: AuthUser }) => {
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

        renderData.props.__user = JSON.stringify(firebaseContext.user) || null;
        renderData.props.__firestore =
          JSON.stringify(firebaseContext.firestore) || null;

        return renderData;
      }
    );
  }
  return serverSideFunction;
}
