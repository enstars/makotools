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
import UserDataProvider from "../services/userData";

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
                <UserDataProvider>
                  {getLayout(<Component {...pageProps} />)}
                </UserDataProvider>
              </AuthProvider>
            </Hydrate>
          </QueryClientProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
