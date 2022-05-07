import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import ErrorBoundary from "./ErrorBoundary";
import {
  AppShell,
  Container,
  Box,
  Paper,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";

const StyledWrapper = styled.div`
  /* color: white; */

  .es-content__wrapper {
    margin: auto;
    display: flow-root;
    max-width: 1100px;
    position: relative;
  }

  .es-content {
    margin-left: 200px;
    padding: 0px;
    min-height: 100vh;
  }
  a {
    color: var(--hokuto-100);
  }

  .es-mainContent {
    min-height: 100vh;
    display: flow-root;
    position: relative;
    display: flex;
    flex-direction: column;

    & > *:not(:last-child) {
      margin-bottom: 0;
    }

    .es-expand {
      flex: 1 1 0;
    }
  }

  .content-text {
    padding: 10px 20px 20px;
  }

  --content-margin: 0.5rem;

  @media only screen and (min-width: 600px) {
    --content-margin: 1rem;
  }
`;

function Layout({
  children: Component,
  footer = true,
  sidebar = true,
  pageTitle,
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
        >
          <Container
            size="sm"
            p="md"
            sx={{
              minHeight: "100vh",
            }}
          >
            <ErrorBoundary>{Component}</ErrorBoundary>
          </Container>
        </Paper>
        {footer ? <Footer /> : null}
      </AppShell>
    </ErrorBoundary>
  );
}
export default Layout;
