// import App from 'next/app'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getCookie, setCookies } from "cookies-next";

import { MantineProvider, ColorSchemeProvider } from "@mantine/core";

import { NotificationsProvider } from "@mantine/notifications";

import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/700.css";
import "@fontsource/sora/800.css";
import "@fontsource/sora/variable.css";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/700.css";
import "@fontsource/inter";
import "@fontsource/inter/variable-full.css";

import AuthProvider from "../services/auth";
import UserDataProvider from "../services/userData";

function App({ Component, pageProps, ...props }) {
  const location = useRouter();
  const [colorScheme, setStateColorScheme] = useState(props.colorScheme);

  const getLayout = Component.getLayout || ((page) => page);

  const setAppColorScheme = (value) => {
    setStateColorScheme(value);
    // when color scheme is updated save it to cookie
    setCookies("color-scheme", value, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };
  const toggleColorScheme = (value) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setAppColorScheme(nextColorScheme);
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <MantineProvider
        // emotionOptions={{ key: "mktl" }}
        withGlobalStyles
        withNormalizeCSS
        // withCSSVariables
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
            lightblue: [
              "#e7f5ff",
              "#d0ebff",
              "#a5d8ff",
              "#74c0fc",
              "#4dabf7",
              "#339af0",
              "#228be6",
              "#1c7ed6",
              "#1971c2",
              "#1864ab",
            ],
          },
          // primaryColor: "green",
          primaryShade: { light: 6, dark: 5 },
          lineHeight: 1.5,
          fontFamily: "InterVariable, Inter, Noto Sans JP, sans-serif",
          headings: {
            fontFamily: "SoraVariable, Sora, InterVariable, Inter, sans-serif",
            fontWeight: 800,
          },
          other: { transition: "0.3s cubic-bezier(.19,.73,.37,.93)" },
          // other: { transition: "2s cubic-bezier(.19,.73,.37,.93)" },
        }}
      >
        <NotificationsProvider>
          <AuthProvider>
            <UserDataProvider setAppColorScheme={setAppColorScheme}>
              <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
                setAppColorScheme={setAppColorScheme}
              >
                {/* <Hydrate state={pageProps.dehydratedState}> */}
                {getLayout(<Component {...pageProps} />, pageProps)}
                {/* </Hydrate> */}
              </ColorSchemeProvider>
            </UserDataProvider>
          </AuthProvider>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }) => ({
  // get color scheme from cookie
  colorScheme: getCookie("color-scheme", ctx) || "dark",
});

export default App;
