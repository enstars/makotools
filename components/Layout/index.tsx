import {
  AppShell,
  Container,
  Paper,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";

import { PageMeta } from "../../types/makotools";

import ErrorBoundary from "./ErrorBoundary";
import Meta from "./Meta";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

function Layout({
  children: Component,
  hideFooter = false,
  hideSidebar = false,
  hideHeader = false,
  wide = false,
  footerTextOnly = false,
  hideOverflow = false,
  pageProps,
  meta,
}: {
  children: any;
  hideFooter: boolean;
  hideSidebar: boolean;
  hideHeader: boolean;
  wide: boolean;
  footerTextOnly: boolean;
  hideOverflow: boolean;
  pageProps?: any;
  meta?: PageMeta;
}) {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const theme = useMantineTheme();
  return (
    <ErrorBoundary>
      <Meta {...{ ...pageProps?.meta, ...meta }} />
      <AppShell
        fixed={false}
        styles={{
          main: {
            padding: 0,
            maxWidth: "calc(100% - var(--mantine-navbar-width))",
          },
          body: {
            minHeight: "100vh",
            position: "relative",
            zIndex: 1,
          },
        }}
        navbar={
          !hideSidebar ? (
            <ErrorBoundary>
              <Sidebar hiddenBreakpoint="xs" />
            </ErrorBoundary>
          ) : (
            <></>
          )
        }
      >
        <Paper
          sx={{
            position: "relative",
            zIndex: 1,
            borderBottom: "solid 1px",
            borderColor: dark ? theme.colors.dark[5] : theme.colors.gray[2],
            overflow: hideOverflow ? "hidden" : undefined,
            background: dark
              ? theme.colors.dark[8]
              : theme.fn.lighten(theme.colors.gray[0], 0.5),
          }}
          radius={0}
          shadow="sm"
        >
          <Container
            size={wide ? "xl" : "sm"}
            px="xl"
            py="md"
            sx={{
              width: "100%",
              minHeight: "100vh",
              "@media (max-width: 768px)": {
                paddingLeft: theme.spacing.md,
                paddingRight: theme.spacing.md,
              },
            }}
          >
            <ErrorBoundary>
              {!hideHeader && (
                <Header
                  getBreadcrumbs={pageProps?.getBreadcrumbs}
                  breadcrumbs={pageProps?.breadcrumbs}
                />
              )}
              {Component}
            </ErrorBoundary>
          </Container>
        </Paper>
        {!hideFooter ? <Footer wide={wide} textOnly={footerTextOnly} /> : null}
      </AppShell>
    </ErrorBoundary>
  );
}
export default Layout;

export const getLayout = (layoutProps: any) => {
  return function LayoutWrapper(children: any, pageProps: any) {
    return (
      <Layout pageProps={pageProps} {...layoutProps}>
        {children}
      </Layout>
    );
  };
};
