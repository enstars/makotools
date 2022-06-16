import OpenInNewSharpIcon from "@mui/icons-material/OpenInNewSharp";
// import "./Splash.module.scss";

function Splash() {
  return (
    <>
      <div className="es-splash">
        <a
          className="es-splash__movie"
          href="https://www.youtube.com/watch?v=fUwOzPdUj94"
          target="_blank"
          rel="noreferrer"
        >
          {/* <PlayArrowSharpIcon /> */}
          <span>Movie</span>
          <OpenInNewSharpIcon />
        </a>
        <div className="es-splash__background" />
        <div className="es-splash__left">
          <div className="es-splash__text">
            {/* <span className="es-splash__text--highlight">
                            <span className="es-splash__text--slideup-0">
                                アンサンブル
                            </span>
                        </span>
                        <span className="es-splash__text--highlight">
                            <span className="es-splash__text--slideup-0">
                                スクエア
                            </span>
                        </span>
                        <span className="es-splash__text--highlight">
                            <span className="es-splash__text--slideup-200">
                                へようこそ
                            </span>
                        </span>
                        <span className="es-splash__text--highlight es-splash__text--2">
                            <span className="es-splash__text--slideup-200">
                                !!
                            </span>
                        </span> */}
            <span className="es-splash__subtext es-splash__text--highlight">
              <span className="es-splash__text--slideup-0">Welcome to</span>
            </span>
            <br />
            <span className="es-splash__text--highlight">
              <span className="es-splash__text--slideup-200">
                Ensemble&nbsp;
              </span>
            </span>
            <span className="es-splash__text--highlight">
              <span className="es-splash__text--slideup-200">
                Square
                <span className="es-splash__text--2">!!&nbsp;&nbsp;&nbsp;</span>
              </span>
            </span>
            <br />
            <span className="es-splash__text--highlight es-splash__tagline">
              <span className="es-splash__text--slideup-400">
                Tools and info for&nbsp;
              </span>
              <span className="es-splash__text--slideup-400">
                Ensemble Stars!! fans
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
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
