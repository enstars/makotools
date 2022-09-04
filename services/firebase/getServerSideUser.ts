import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import {
  AuthUser,
  AuthUserContext,
  FirebaseAdminType,
  getFirebaseAdmin,
  withAuthUserTokenSSR,
} from "next-firebase-auth";

import { UserData } from "../../types/makotools";

export type GetServerSidePropsWithUser<
  P extends { [key: string]: any } = { [key: string]: any }
> = (
  context: GetServerSidePropsContext & {
    user: AuthUser;
    admin: FirebaseAdminType;
    firestore: UserData;
  }
) => Promise<GetServerSidePropsResult<P>>;

export default function getServerSideUser(
  serverSideFunction: GetServerSidePropsWithUser,
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
        context.res.setHeader(
          "Cache-Control",
          "public, s-maxage=7200, stale-while-revalidate=172800"
        );
        // refresh every 2 hours, stale for 48hrs

        const user = AuthUser;
        const admin = getFirebaseAdmin();
        let firebaseContext: any = {};

        if (AuthUser.id) {
          // user is logged in

          const db = admin.firestore();
          const docRef = db.collection("users").doc(AuthUser.id);
          const firestore = await (await docRef.get()).data();

          firebaseContext = {
            firestore,
            user,
            admin,
          };
        }

        const renderData = serverSideFunction
          ? await serverSideFunction({ ...context, ...firebaseContext })
          : { props: {} };

        if ("notFound" in renderData) return renderData;
        if ("redirect" in renderData) return renderData;

        try {
          renderData.props = {
            ...renderData.props,
            __user: JSON.stringify(firebaseContext.user),
            __firestore: JSON.stringify(firebaseContext.firestore),
          };
        } catch {}

        return renderData;
      }
    );
  }
  return serverSideFunction;
}
