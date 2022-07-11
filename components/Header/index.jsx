import { useState, useEffect } from "react";
import styled from "styled-components";
import Breadcrumbs from "./Breadcrumbs";
import { useWindowScroll } from "@mantine/hooks";
import { Affix, Transition, useMantineTheme, Header } from "@mantine/core";

function HeaderApp() {
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <Affix
      position={{ top: 0, right: 0 }}
      sx={{ width: " calc(100% - var(--mantine-navbar-width))" }}
    >
      <Transition transition="slide-down" mounted={scroll.y > 40}>
        {(transitionStyles) => (
          <Header
            style={{
              ...transitionStyles,
            }}
            px="sm"
            py={6}
            sx={(theme) => ({ boxShadow: theme.shadows.sm })}
          >
            <Breadcrumbs />
          </Header>
        )}
      </Transition>
    </Affix>
  );
}

export default HeaderApp;
