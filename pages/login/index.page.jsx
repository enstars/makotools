import { useEffect } from "react";

import Login from "../../components/Login";

import { useFirebaseUser } from "../../services/firebase/user";
import { useRouter } from "next/router";

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

export default Page;

import Layout from "../../components/Layout";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { AuthAction } from "next-firebase-auth";

Page.getLayout = function getLayout(page, pageProps) {
  return (
    <Layout hideHeader hideFooter hideSidebar pageProps={pageProps}>
      {page}
    </Layout>
  );
};

export const getServerSideProps = getServerSideUser(
  () => {
    return { props: {} };
  },
  {
    whenAuthed: AuthAction.REDIRECT_TO_APP,
  }
);
