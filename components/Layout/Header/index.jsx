import styled from "styled-components";
import Breadcrumbs from "./Breadcrumbs";
import { useWindowScroll } from "@mantine/hooks";
import { Affix, Transition, useMantineTheme, Header } from "@mantine/core";

function HeaderApp() {
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <Affix
      position={{ top: 0, right: 0 }}
      sx={{ width: " calc(100% - var(--mantine-navbar-width))", zIndex: 200 }}
    >
      <Transition transition="slide-down" mounted={scroll.y > 40}>
        {(transitionStyles) => (
          <Header
            style={{
              ...transitionStyles,
            }}
            px="sm"
            py="sm"
            sx={(theme) => ({ boxShadow: theme.shadows.sm })}
          >
            <Breadcrumbs sx={{ height: 20 }} />
          </Header>
        )}
      </Transition>
    </Affix>
  );
}

export default HeaderApp;
