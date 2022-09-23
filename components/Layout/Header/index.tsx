import { useWindowScroll } from "@mantine/hooks";
import { Affix, Transition, Header, Drawer } from "@mantine/core";
import { useState } from "react";

import Sidebar from "../Sidebar";

import Breadcrumbs from "./Breadcrumbs";

const cornerSize = 8;

function HeaderApp({
  getBreadcrumbs,
  title,
  breadcrumbs,
}: {
  getBreadcrumbs: (path: string) => string[];
  title: string;
  breadcrumbs: string[];
}) {
  const [scroll] = useWindowScroll();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        size="sm"
        styles={{ header: { display: "none" } }}
        shadow="xl"
      >
        <Sidebar
          permanentlyExpanded
          width={0}
          onCollapse={() => {
            setOpened(false);
          }}
          hidden={false}
        />
      </Drawer>
      <Affix
        position={{ top: 0, right: 0 }}
        sx={{
          width: "calc(100% - var(--mantine-navbar-width, 0px))",
          zIndex: 200,
          boxSizing: "content-box",
        }}
      >
        <Transition transition="slide-down" mounted={scroll.y > 40 && !opened}>
          {(transitionStyles) => (
            <Header
              style={{
                ...transitionStyles,
              }}
              height="auto"
              px="md"
              // py={0}
              sx={(theme) => ({
                paddingTop: theme.spacing.xs / 1.5,
                paddingBottom: theme.spacing.xs / 1.5,
                minHeight: 37,
                display: "flex",
                alignItems: "center",
                boxShadow: theme.shadows.sm,
                maskRepeat: "repeat-y",
                maskSize: "200% 30%",
                maskClip: "no-clip",
                maskImage: "linear-gradient(black, black)",
                [theme.fn.largerThan("xs")]: {
                  ":before": {
                    content: "''",
                    position: "absolute",
                    left: 0,
                    top: "100%",
                    width: cornerSize,
                    height: cornerSize,
                    background: `top left/200% 200% radial-gradient(transparent ${
                      cornerSize - 1
                    }px,  ${
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[5]
                        : theme.colors.gray[2]
                    } ${cornerSize - 1}px, ${
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[5]
                        : theme.colors.gray[2]
                    } ${cornerSize}px, ${
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[7]
                        : theme.white
                    } ${cornerSize}px)`,
                  },
                },
              })}
            >
              <Breadcrumbs
                getBreadcrumbs={getBreadcrumbs}
                breadcrumbs={breadcrumbs}
                setOpened={setOpened}
              />
            </Header>
          )}
        </Transition>
      </Affix>

      <Breadcrumbs
        getBreadcrumbs={getBreadcrumbs}
        breadcrumbs={breadcrumbs}
        setOpened={setOpened}
      />
    </>
  );
}

export default HeaderApp;
