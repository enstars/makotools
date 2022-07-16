import Head from "next/head";
import { useMantineTheme } from "@mantine/core";

function RouteChangeLoader() {
  const theme = useMantineTheme();
  return (
    <Head>
      <style>{`#nprogress .bar { background: ${
        theme.colors[theme.primaryColor][theme.primaryShade[theme.colorScheme]]
      }; height: 3px; border-radius: 0 0 2px 0 } #nprogress .spinner { top: 12px } #nprogress .spinner-icon { border-top-color: ${
        theme.colors[theme.primaryColor][theme.primaryShade[theme.colorScheme]]
      }; border-left-color: ${
        theme.colors[theme.primaryColor][theme.primaryShade[theme.colorScheme]]
      }; }`}</style>
    </Head>
  );
}

export default RouteChangeLoader;
