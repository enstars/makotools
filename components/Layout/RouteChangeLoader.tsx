import Head from "next/head";
import { useMantineTheme } from "@mantine/core";

function RouteChangeLoader() {
  const theme = useMantineTheme();
  return (
    <Head>
      <style>{`#nprogress .bar { background: ${theme.fn.primaryColor()}; height: 3px; border-radius: 0 0 2px 0 } #nprogress .spinner { top: 12px } #nprogress .spinner-icon { border-top-color: ${theme.fn.primaryColor()}; border-left-color: ${theme.fn.primaryColor()}; }`}</style>
    </Head>
  );
}

export default RouteChangeLoader;
