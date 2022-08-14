import { useEffect } from "react";

import { useRouter } from "next/router";

import { AuthAction } from "next-firebase-auth";

import { useFirebaseUser } from "../../services/firebase/user";

import getServerSideUser from "../../services/firebase/getServerSideUser";

import { getLayout } from "../../components/Layout";

import Login from "./Login";

function Page() {
  const router = useRouter();
  const { firebaseUser } = useFirebaseUser();

  useEffect(() => {
    if (!firebaseUser.loading && firebaseUser.loggedIn) {
      router.push("/");
    }
  }, [firebaseUser, router]);

  return <Login />;
}

export const getServerSideProps = getServerSideUser(
  () => {
    return { props: {} };
  },
  {
    whenAuthed: AuthAction.REDIRECT_TO_APP,
  }
);
Page.getLayout = getLayout({
  hideSidebar: true,
  hideFooter: true,
  hideHeader: true,
});
export default Page;
