import { AppShell, Container, Paper, useMantineTheme } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { createContext, useContext } from "react";

import { PageMeta } from "types/makotools";

import ErrorBoundary from "./ErrorBoundary";
import Meta from "./Meta";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const SidebarStatusContext = createContext<any>(null);
export const useSidebarStatus = () => useContext(SidebarStatusContext);

function Layout({
  children: Component,
  hideFooter = false,
  hideSidebar = false,
  hideHeader = false,
  hideHeadBreadcrumb = false,
  wide = false,
  footerTextOnly = false,
  hideOverflow = true,
  pageProps,
  meta,
  headerProps = {},
}: {
  children: any;
  hideFooter: boolean;
  hideSidebar: boolean;
  hideHeader: boolean;
  hideHeadBreadcrumb: boolean;
  wide: boolean;
  footerTextOnly: boolean;
  hideOverflow: boolean;
  pageProps?: any;
  meta?: PageMeta;
  headerProps?: any;
}) {
  const theme = useMantineTheme();
  const dark = theme.colorScheme === "dark";
  const [collapsed, toggleCollapsed] = useToggle([false, true]);

  // collapsed={collapsed}
  // toggleCollapsed={collapsed}
  return (
    <ErrorBoundary>
      <Meta {...{ ...pageProps?.meta, ...meta }} />

      <SidebarStatusContext.Provider value={{ collapsed, toggleCollapsed }}>
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
            // shadow="sm"
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
                    hideHeadBreadcrumb={hideHeadBreadcrumb}
                    headerProps={headerProps}
                  />
                )}
                {Component}
              </ErrorBoundary>
            </Container>
          </Paper>
          {!hideFooter ? (
            <Footer wide={wide} textOnly={footerTextOnly} />
          ) : null}
        </AppShell>
      </SidebarStatusContext.Provider>
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
