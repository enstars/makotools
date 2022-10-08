import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getCookie, setCookie } from "cookies-next";
import {
  MantineProvider,
  ColorSchemeProvider,
  createEmotionCache,
  ColorScheme,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/700.css";
import "@fontsource/sora/800.css";
import "@fontsource/sora/variable.css";
import "@fontsource/noto-sans-jp/japanese-400.css";
import "@fontsource/noto-sans-jp/japanese-500.css";
import "@fontsource/noto-sans-jp/japanese-700.css";
import "../styles/inter.scss";
import "../styles/wordpress.scss";
import { withAuthUser } from "next-firebase-auth";
import {
  startNavigationProgress,
  resetNavigationProgress,
  NavigationProgress,
} from "@mantine/nprogress";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { initAuthentication } from "../services/firebase/authentication";
import { UserProvider } from "../services/firebase/user";
import DayjsProvider from "../services/libraries/dayjs";

import { CONSTANTS } from "services/makotools/constants";
initAuthentication();

const emotionCache = createEmotionCache({ key: "mktl" });

function MakoTools({
  Component,
  pageProps,
  initColorScheme,
}: {
  Component: any;
  pageProps: any;
  initColorScheme: ColorScheme;
}) {
  const router = useRouter();
  const [colorScheme, setStateColorScheme] = useState(
    initColorScheme || "dark"
  );

  const getLayout = Component.getLayout || ((page: any) => page);

  const setAppColorScheme = (value: any) => {
    setStateColorScheme(value);
    setCookie("color-scheme", value, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  const toggleAppColorScheme = () => {
    setAppColorScheme(colorScheme === "light" ? "dark" : "light");
  };

  const getDimmed = (theme: any) => {
    return theme.colorScheme === "dark"
      ? theme.colors.dark[2]
      : theme.colors.gray[6];
  };

  const getColor = (theme: any, color: any) =>
    theme.colors[color][theme.colorScheme === "dark" ? 5 : 7];

  useEffect(() => {
    const handleStart = (url: any) =>
      url !== router.asPath && startNavigationProgress();
    const handleComplete = () => resetNavigationProgress();

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.asPath, router.events]);

  return (
    <GoogleReCaptchaProvider reCaptchaKey={CONSTANTS.KEYS.CAPTCHA}>
      <MantineProvider
        emotionCache={emotionCache}
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
          components: {
            NavLink: {
              styles: (theme) => ({
                root: {
                  "& > *:last-child": {
                    margin: 0,
                  },
                },
              }),
            },
          },
          colors: {
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
            blue: [
              "#edf2ff",
              "#dbe4ff",
              "#bac8ff",
              "#91a7ff",
              "#748ffc",
              "#5c7cfa",
              "#4c6ef5",
              "#4263eb",
              "#3b5bdb",
              "#364fc7",
            ],
          },
          primaryShade: { light: 6, dark: 5 },
          lineHeight: 1.5,
          fontFamily: "Inter var, Inter, Noto Sans JP, sans-serif",
          headings: {
            fontFamily: "SoraVariable, Sora, InterVariable, Inter, sans-serif",
            fontWeight: 800,
          },
          other: {
            transition: "0.3s cubic-bezier(.19,.73,.37,.93)",
            setAppColorScheme,
            toggleAppColorScheme,
            getDimmed,
            getColor,
          },
        }}
      >
        <NavigationProgress />
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <NotificationsProvider position="top-center">
          <UserProvider
            setAppColorScheme={setAppColorScheme}
            colorScheme={colorScheme}
            serverData={{
              user: pageProps?.__user
                ? JSON.parse(pageProps.__user)
                : undefined,
              db: pageProps?.__db ? JSON.parse(pageProps.__db) : undefined,
            }}
          >
            {/*  TODO: Remove this just use the theme povider */}
            <DayjsProvider>
              <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={setAppColorScheme}
              >
                {getLayout(<Component {...pageProps} />, pageProps)}
              </ColorSchemeProvider>
            </DayjsProvider>
          </UserProvider>
        </NotificationsProvider>
      </MantineProvider>
    </GoogleReCaptchaProvider>
  );
}

MakoTools.getInitialProps = ({ ctx }: { ctx: any }) => {
  return {
    initColorScheme: getCookie("color-scheme", ctx) || "light",
  };
};

export default withAuthUser()(MakoTools);
