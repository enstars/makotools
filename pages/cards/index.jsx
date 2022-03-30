function Page() {
  return (
    <div className="content-text">
      <h1>Cards</h1>
      <p>This is the Cards page</p>
    </div>
  );
}

export default Page;

import Layout from "../../components/Layout";
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
