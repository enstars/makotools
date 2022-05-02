// import App from 'next/app'
import React, { useState, useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { getCookie, setCookies } from "cookies-next";

import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";

import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

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

function App({ Component, pageProps, ...props }) {
  const location = useRouter();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [queryClient] = useState(() => new QueryClient());
  const [colorScheme, setColorScheme] = useState(props.colorScheme);
  // const [colorScheme, setColorScheme] = useState("dark");

  useEffect(() => {
    setCurrentPath(location.pathname);
    // console.log(currentPath);
  }, [location]);

  const getLayout = Component.getLayout || ((page) => page);

  const toggleColorScheme = (value) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    // when color scheme is updated save it to cookie
    setCookies("color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <AuthProvider>
        <UserDataProvider>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={{
                colorScheme,
                colors: {
                  // override dark colors to change them for all components
                  dark: [
                    "#D3D6E0",
                    "#AAB1C2",
                    "#8E97AD",
                    "#5F6982",
                    "#3A4259",
                    "#2C3347",
                    "#212736",
                    "#191C27",
                    "#171921",
                    "#12141C",
                  ],
                  blue: [
                    "#E8ECFD",
                    "#C0CAF4",
                    "#A4B1E8",
                    "#8297EE",
                    "#5E78E3",
                    "#3C59D1",
                    "#324CB3",
                    "#273E96",
                    "#1C2F7D",
                    "#14297A",
                  ],
                },
                headings: {
                  fontFamily: "Metropolis, InterVariable, Inter, sans-serif",
                },
              }}
            >
              <QueryClientProvider client={queryClient}>
                {/* <Hydrate state={pageProps.dehydratedState}> */}
                {getLayout(<Component {...pageProps} />)}
                {/* </Hydrate> */}
              </QueryClientProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </UserDataProvider>
      </AuthProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }) => ({
  // get color scheme from cookie
  colorScheme: getCookie("color-scheme", ctx) || "dark",
});

export default App;
