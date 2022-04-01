import Login from "../../components/Login";
import { useAuth } from "../../services/auth";
import { useUserData } from "../../services/userData";
function Page() {
  const authUser = useAuth();
  const { userData, setUserDataKey } = useUserData();

  return <Login />;
}

export default Page;

import Layout from "../../components/Layout";
Page.getLayout = function getLayout(page) {
  return <Layout footer={false}>{page}</Layout>;
};
