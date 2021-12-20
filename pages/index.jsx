import Homepage3D from "../components/Homepage3D";

function Splash() {
  return <>{/* <Homepage3D /> */}</>;
}
function Home() {
  return (
    <>
      <Splash />
      {/* <div className="content-text" /> */}
    </>
  );
}

export default Home;

import Layout from "../components/Layout";
Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
