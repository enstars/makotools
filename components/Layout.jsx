import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import ErrorBoundary from "./ErrorBoundary";
import Meta from "./Meta";
import {
  AppShell,
  Container,
  Box,
  Paper,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";

function Layout({
  children: Component,
  footer = true,
  sidebar = true,
  wide = false,
  pageTitle,
  meta,
  footerTextOnly,
}) {
  const location = useRouter();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  useEffect(() => {
    setCurrentPath(location.pathname);
    // console.log(currentPath);
  }, [location]);

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <ErrorBoundary>
      <AppShell
        styles={{
          main: {
            padding: 0,
          },
          body: {
            minHeight: "100vh",
            position: "relative",
            zIndex: 1,
          },
        }}
        navbar={
          sidebar ? <Sidebar opened={opened} setOpened={setOpened} /> : null
        }
      >
        <Header pageTitle={pageTitle} />
        <Paper
          sx={{
            position: "relative",
            zIndex: 1,
            borderBottom: "solid 1px",
            borderColor: dark ? theme.colors.dark[5] : theme.colors.gray[2],
          }}
          radius={0}
          shadow="lg"
        >
          <Container
            size={wide ? "xl" : "sm"}
            p="xl"
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
              <Meta {...meta}></Meta>
              {Component}
            </ErrorBoundary>
          </Container>
        </Paper>
        {footer ? <Footer wide={wide} textOnly={footerTextOnly} /> : null}
      </AppShell>
    </ErrorBoundary>
  );
}
export default Layout;
