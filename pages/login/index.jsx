import { useEffect } from "react";
import Login from "../../components/Login";
import { useUserData } from "../../services/userData";
import { useAuth } from "../../services/auth";
import { useRouter } from "next/router";
function Page() {
  const router = useRouter();
  const { user } = useAuth();
  const { userData, setUserDataKey } = useUserData();

  useEffect(() => {
    if (!userData.loading && userData.loggedIn) {
      router.push("/");
    }
  }, [userData, router]);

  return <Login />;
}

export default Page;

import Layout from "../../components/Layout";

Page.getLayout = function getLayout(page) {
  return (
    <Layout footer={false} sidebar={false}>
      {page}
    </Layout>
  );
};
