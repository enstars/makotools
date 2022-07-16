import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Breadcrumbs,
  Anchor,
  Text,
  Group,
  useMantineTheme,
  Drawer,
  Box,
  MediaQuery,
  ActionIcon,
} from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";
import Sidebar from "../Sidebar";

function BreadcrumbsApp(props) {
  const theme = useMantineTheme();
  const location = useRouter();
  const [pathnames, setPathnames] = useState(
    location.asPath.split("/").filter((x) => x)
  );
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setPathnames(location.asPath.split("/").filter((x) => x));
  }, [location]);

  return (
    <Box px="xs" {...props}>
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
      <Group>
        <MediaQuery largerThan="xs" styles={{ display: "none" }}>
          <ActionIcon>
            <IconMenu2 size={18} onClick={() => setOpened(!opened)} />
          </ActionIcon>
        </MediaQuery>
        <Text
          transform="uppercase"
          weight="600"
          sx={(theme) => ({
            zIndex: 10,
            position: "relative",
            letterSpacing: "0.05em",
            fontSize: theme.fontSizes.sm - 2,
          })}
        >
          <Breadcrumbs
            separator={
              <Text inherit color="dimmed">
                /
              </Text>
            }
            styles={(theme) => ({
              separator: {
                marginLeft: theme.spacing.xs / 1.75,
                marginRight: theme.spacing.xs / 1.75,
              },
            })}
          >
            <Link href="/" passHref>
              <Anchor inherit>Makotools</Anchor>
            </Link>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;

              return (
                <Link key={value} href={to} passHref>
                  <Anchor inherit>{decodeURIComponent(value)}</Anchor>
                </Link>
              );
            })}
          </Breadcrumbs>
        </Text>
      </Group>
    </Box>
  );
}

export default BreadcrumbsApp;
