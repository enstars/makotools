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
  ScrollArea,
} from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";

import Sidebar from "../Sidebar";

const defaultGetBreadcrumbs = (path: string) =>
  path.split("/").filter((x) => x);

function BreadcrumbsApp({
  getBreadcrumbs = defaultGetBreadcrumbs,
  breadcrumbs,
  setOpened,
  ...props
}: {
  getBreadcrumbs: (path: string) => string[];
  breadcrumbs: string[];
  setOpened: any;
}) {
  const location = useRouter();
  let pageBreadcrumbs = breadcrumbs || getBreadcrumbs(location.asPath);

  return (
    <Group noWrap align="center" {...props}>
      <MediaQuery largerThan="xs" styles={{ display: "none" }}>
        <Box sx={{ alignSelf: "stretch" }}>
          <ActionIcon onClick={() => setOpened((o: boolean) => !o)}>
            <IconMenu2 size={18} />
          </ActionIcon>
        </Box>
      </MediaQuery>
      <Text
        // component={ScrollArea}
        transform="uppercase"
        weight="600"
        sx={(theme) => ({
          zIndex: 10,
          position: "relative",
          letterSpacing: "0.05em",
          fontSize: theme.fontSizes.sm - 2,
          // marginTop: theme.fontSizes.sm * 0.15,
          maxWidth: "100%",
        })}
        inline
      >
        <Breadcrumbs
          // py="xs"
          separator={
            <Text inherit color="dimmed" component="span">
              /
            </Text>
          }
          styles={(theme) => ({
            separator: {
              display: "inline",
              marginLeft: theme.spacing.xs / 1.75,
              marginRight: theme.spacing.xs / 1.75,
            },
            root: {
              // whiteSpace: "nowrap",
              display: "block",
              lineHeight: 1.5,
              paddingTop: theme.spacing.xs * 0.25,
              paddingBottom: theme.spacing.xs * 0.25,
            },
          })}
        >
          <Link href="/" passHref>
            <Anchor inherit>Makotools</Anchor>
          </Link>
          {pageBreadcrumbs.map((crumb: string, index: number) => {
            const to = `/${pageBreadcrumbs.slice(0, index + 1).join("/")}`;

            return (
              <Link key={crumb} href={to} passHref>
                <Anchor inherit>{decodeURIComponent(crumb)}</Anchor>
              </Link>
            );
          })}
        </Breadcrumbs>
      </Text>
    </Group>
  );
}

export default BreadcrumbsApp;
