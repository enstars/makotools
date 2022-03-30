import Login from "../../components/Login";

function Page() {
  return (
    <div className="content-text">
      <Login />
    </div>
  );
}

export default Page;

import Layout from "../../components/Layout";
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
