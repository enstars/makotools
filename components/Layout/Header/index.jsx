import Breadcrumbs from "./Breadcrumbs";
import { useWindowScroll } from "@mantine/hooks";
import { Affix, Transition, Header } from "@mantine/core";

function HeaderApp({ getBreadcrumbs }) {
  const [scroll] = useWindowScroll();
  return (
    <Affix
      position={{ top: 0, right: 0 }}
      sx={{ width: "calc(100% - var(--mantine-navbar-width))", zIndex: 200 }}
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
            <Breadcrumbs sx={{ height: 20 }} getBreadcrumbs={getBreadcrumbs} />
          </Header>
        )}
      </Transition>
    </Affix>
  );
}

export default HeaderApp;
