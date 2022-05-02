import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Sidebar from "./Sidebar";
// import Header from "./Header";
import Footer from "./Footer";
import ErrorBoundary from "./ErrorBoundary";
import {
  AppShell,
  Navbar,
  Header,
  // Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
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

function Layout({ children: Component, footer = true }) {
  const location = useRouter();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
    // console.log(currentPath);
  }, [location]);

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<Sidebar opened={opened} setOpened={setOpened} />}
    >
      <ErrorBoundary>{Component}</ErrorBoundary>
      <Footer height={60} p="md">
        Application footer
      </Footer>
    </AppShell>
  );
}
export default Layout;
