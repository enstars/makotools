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

Page.getLayout = function getLayout(page) {
  return (
    <Layout hideHeader hideFooter hideSidebar>
      {page}
    </Layout>
  );
};
