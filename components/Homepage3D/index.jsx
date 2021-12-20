import { useEffect } from "react";
import Head from "next/head";

function Homepage3D() {
  return (
    <div>
      <canvas id="canvas3d" />
      <Head>
        <script type="module">
          {`import {Application} from './spline/runtime.js'; const app = new Application();app.load('./spline/scene.json');`}
        </script>
      </Head>
    </div>
  );
}

export default Homepage3D;
