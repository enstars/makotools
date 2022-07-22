import App from "next/app";
import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import { getCookie, setCookie } from "cookies-next";
import NProgress from "nprogress";

import { MantineProvider, ColorSchemeProvider, Tooltip } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/700.css";
import "@fontsource/sora/800.css";
import "@fontsource/sora/variable.css";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/700.css";
// import "@fontsource/inter";
// import "@fontsource/inter/variable-full.css";

import "../styles/styles.css";

import initAuth from "../services/firebase/authentication";
import FirebaseUserProvider from "../services/firebase/user";

import { withAuthUser } from "next-firebase-auth";
import RouteChangeLoader from "../components/Layout/RouteChangeLoader";

Router.onRouteChangeStart = (url) => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

initAuth();

function MakoTools({ Component, pageProps, ...props }) {
  const location = useRouter();
  const [colorScheme, setStateColorScheme] = useState(
    props.colorScheme || "dark"
  );

  const getLayout = Component.getLayout || ((page) => page);

  const setAppColorScheme = (value) => {
    setStateColorScheme(value);

    // when color scheme is updated save it to cookie
    setCookie("color-scheme", value, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };
  const toggleAppColorScheme = () => {
    setAppColorScheme(colorScheme === "light" ? "dark" : "light");
  };

  return (
    <MantineProvider
      emotionOptions={{ key: "mktl" }}
      withGlobalStyles
      withNormalizeCSS
      styles={{
        Tooltip: (theme) => ({
          body: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[9]
                : theme.colors.gray[9],
            color:
              theme.colorScheme === "dark"
                ? theme.colors.dark[1]
                : theme.colors.gray[1],
            fontWeight: 500,
          },
          arrow: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[9]
                : theme.colors.gray[9],
          },
        }),
        Image: {
          image: {
            position: "relative",
            zIndex: 10,
          },
        },
      }}
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
        primaryShade: { light: 6, dark: 5 },
        lineHeight: 1.5,
        // fontFamily: "InterVariable, Inter, Noto Sans JP, sans-serif",
        fontFamily: "Inter var, Inter, Noto Sans JP, sans-serif",
        headings: {
          fontFamily: "SoraVariable, Sora, InterVariable, Inter, sans-serif",
          fontWeight: 800,
        },
        other: {
          transition: "0.3s cubic-bezier(.19,.73,.37,.93)",
          setAppColorScheme,
          toggleAppColorScheme,
        },
      }}
    >
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <RouteChangeLoader />
      <NotificationsProvider position="top-center">
        <FirebaseUserProvider
          setAppColorScheme={setAppColorScheme}
          colorScheme={colorScheme}
        >
          {/*  TODO: Remove this just use the theme povider */}
          <ColorSchemeProvider
            colorScheme={colorScheme}
            setAppColorScheme={setAppColorScheme}
          >
            {getLayout(<Component {...pageProps} />, pageProps)}
          </ColorSchemeProvider>
        </FirebaseUserProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

MakoTools.getInitialProps = ({ ctx }) => {
  return {
    colorScheme: getCookie("color-scheme", ctx) || "light",
  };
};

export default withAuthUser()(MakoTools);
