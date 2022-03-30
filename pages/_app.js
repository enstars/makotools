// import App from 'next/app'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { StyledEngineProvider } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material";
import Head from "next/head";

import "@fontsource/metropolis/400.css";
import "@fontsource/metropolis/500.css";
import "@fontsource/metropolis/700.css";
import "@fontsource/metropolis/900.css";
import "@fontsource/metropolis/400-italic.css";
import "@fontsource/metropolis/500-italic.css";
import "@fontsource/metropolis/700-italic.css";
import "@fontsource/metropolis/900-italic.css";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/700.css";
import "@fontsource/inter";
import "@fontsource/inter/variable-full.css";

import "normalize.css/normalize.css";
import "../styles/index.scss";

import AuthProvider from "../services/auth";

// const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: [
      "Barlow",
      "Noto Sans JP",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
    ].join(","),
    fontSize: 16,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  const location = useRouter();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setCurrentPath(location.pathname);
    // console.log(currentPath);
  }, [location]);

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <AuthProvider>
                {/* <iframe
                  title="Site Background"
                  className="es-site__background"
                  width="1920"
                  height="1080"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src="https://virtualsky.lco.global/embed/index.html?longitude=139.839478&latitude=35.652832&gradient=false&projection=stereo&mouse=false&keyboard=false&cardinalpoints=false&showplanets=false&showplanetlabels=false&showdate=false&showposition=false&color=#000&az=318.6611215126213"
                  allowtransparency="true"
                /> */}
                {getLayout(<Component {...pageProps} />)}
              </AuthProvider>
            </Hydrate>
          </QueryClientProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
