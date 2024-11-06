import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCookie, setCookie } from "cookies-next";
import { ColorScheme } from "@mantine/core";
import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/700.css";
import "@fontsource/sora/800.css";
import "@fontsource/sora/variable.css";
import "@fontsource/noto-sans-jp/japanese-400.css";
import "@fontsource/noto-sans-jp/japanese-500.css";
import "@fontsource/noto-sans-jp/japanese-700.css";
import "styles/inter.scss";
import {
  startNavigationProgress,
  resetNavigationProgress,
} from "@mantine/nprogress";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";
import { withAuthUser } from "next-firebase-auth";

import { initAuthentication } from "services/firebase/authentication";
import { UserProvider } from "services/firebase/user";
import DayjsProvider from "services/libraries/dayjs";
import MantineTheme from "components/MantineTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

initAuthentication();

const queryClient = new QueryClient();

function MakoTools({
  Component,
  pageProps,
  initColorScheme,
}: {
  initColorScheme: ColorScheme;
} & AppProps) {
  const router = useRouter();
  const [colorScheme, setStateColorScheme] = useState(
    initColorScheme || "dark"
  );

  // @ts-ignore / im too lazy to do this shit
  const getLayout = Component.getLayout || ((page: any) => page);

  const setAppColorScheme = (value: "light" | "dark") => {
    setStateColorScheme(value);
    setCookie("color-scheme", value, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  const toggleAppColorScheme = () => {
    setAppColorScheme(colorScheme === "light" ? "dark" : "light");
  };

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
    <>
      <VercelAnalytics />
      <QueryClientProvider client={queryClient}>
        <UserProvider
          setAppColorScheme={setAppColorScheme}
          colorScheme={colorScheme}
        >
          <DayjsProvider>
            <MantineTheme
              colorScheme={colorScheme}
              setAppColorScheme={setAppColorScheme}
              toggleAppColorScheme={toggleAppColorScheme}
            >
              {getLayout(<Component {...pageProps} />, pageProps)}
            </MantineTheme>
          </DayjsProvider>
        </UserProvider>
      </QueryClientProvider>
    </>
  );
}

MakoTools.getInitialProps = ({ ctx }: { ctx: any }) => {
  return {
    initColorScheme: getCookie("color-scheme", ctx) || "light",
  };
};

export default withAuthUser()(MakoTools);
