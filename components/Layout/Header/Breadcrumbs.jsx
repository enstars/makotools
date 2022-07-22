import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Breadcrumbs,
  Anchor,
  Text,
  Group,
  Drawer,
  Box,
  MediaQuery,
  ActionIcon,
} from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";
import Sidebar from "../Sidebar";

const defaultGetBreadcrumbs = (path) => path.split("/").filter((x) => x);

function BreadcrumbsApp({ getBreadcrumbs = defaultGetBreadcrumbs, ...props }) {
  const location = useRouter();
  const [opened, setOpened] = useState(false);
  const breadcrumbs = getBreadcrumbs(location.asPath);

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
            {breadcrumbs.map((crumb, index) => {
              const pathnames = defaultGetBreadcrumbs(location.asPath);
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;

              return (
                <Link key={crumb} href={to} passHref>
                  <Anchor inherit>{decodeURIComponent(crumb)}</Anchor>
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
