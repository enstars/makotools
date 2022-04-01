function Home() {
  return (
    <>
      yeah i know this is kinda boring for a first page ill fill it up later.
      for now just click sidebar stuff
      {/* <div className="content-text" /> */}
    </>
  );
}

export default Home;

import Layout from "../components/Layout";
Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
