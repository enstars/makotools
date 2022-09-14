import { UrlObject } from "url";

import React, { forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "next/router";
import {
  IconUsers,
  IconPlayCard,
  IconAward,
  IconBooks,
  IconUser,
  IconDotsCircleHorizontal,
  IconChevronRight,
  IconChevronLeft,
  IconBrandPatreon,
  IconSettings,
  IconUserCircle,
  TablerIcon,
} from "@tabler/icons";
import {
  Navbar,
  ScrollArea,
  Group,
  Text,
  Box,
  useMantineTheme,
  useMantineColorScheme,
  Badge,
  Button,
  Tooltip,
  NavLink,
  Stack,
  ActionIcon,
  UnstyledButton,
} from "@mantine/core";
import { useColorScheme, useToggle } from "@mantine/hooks";
import { StringNullableChain } from "lodash";

import MakotoolsLightComponent from "../../../assets/Logo/mkt_light_icon.svg";
import MakotoolsDarkComponent from "../../../assets/Logo/mkt_dark_icon.svg";
import MakotoolsTextLightComponent from "../../../assets/Logo/mkt_light_text.svg";
import MakotoolsTextDarkComponent from "../../../assets/Logo/mkt_dark_text.svg";
import { useFirebaseUser } from "../../../services/firebase/user";

import UserMenu from "./UserMenu";

type LinkObject = {
  link: string;
  name?: string;
  icon?: TablerIcon;
  soon?: boolean;
  props?: any;
};

function Sidebar(props: any) {
  const location = useRouter();

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { user } = useFirebaseUser();

  const [collapsed, toggleCollapsed] = useToggle([false, true]);
  // console.log("collapsed", collapsed);
  if (props.permanentlyExpanded && collapsed) toggleCollapsed();

  const linkList: LinkObject[] = [
    {
      link: "/characters",
      name: "Characters",
      icon: IconUsers,
    },
    {
      link: "/cards",
      name: "Cards",
      icon: IconPlayCard,
    },
    {
      link: "/events",
      name: "Events",
      icon: IconAward,
      soon: true,
    },
    {
      link: "/stories",
      name: "Stories",
      icon: IconBooks,
      soon: true,
    },
    ...[
      !user.loading && user.loggedIn
        ? {
            link: `/@${user?.db?.username}`,
            name: "Profile",
            icon: IconUserCircle,
          }
        : {
            link: "",
          },
    ],
    {
      link: "https://www.patreon.com/makotools",
      name: "Patreon",
      // icon: IconBrandPatreon,
      props: {
        // active: true,
        color: "orange",
        variant: "subtle",
        icon: <IconBrandPatreon size={16} color={theme.colors.orange[5]} />,
        description: collapsed ? null : "Support us!",
      },
    },
  ];
  return (
    <Navbar
      // fixed
      position={{ top: 0, left: 0 }}
      width={{
        base: 0,
        xs: collapsed ? 40 : 250,
      }}
      hidden={true}
      hiddenBreakpoint="xs"
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        zIndex: 210,
        boxShadow: theme.shadows.xl,
      }}
      {...props}
    >
      <Navbar.Section>
        <Link href="/" passHref>
          <NavLink
            component="a"
            py="xs"
            label={
              !collapsed && (
                <Text inline>
                  {theme.colorScheme === "light" ? (
                    <MakotoolsTextLightComponent
                      viewBox="0 0 1753 281"
                      width={90}
                      height={14}
                    />
                  ) : (
                    <MakotoolsTextDarkComponent
                      viewBox="0 0 1753 281"
                      width={90}
                      height={14}
                    />
                  )}
                </Text>
              )
            }
            icon={
              theme.colorScheme === "light" ? (
                <MakotoolsLightComponent
                  viewBox="0 0 281 281"
                  width={16}
                  height={16}
                />
              ) : (
                <MakotoolsDarkComponent
                  viewBox="0 0 281 281"
                  width={16}
                  height={16}
                />
              )
            }
          />
        </Link>
      </Navbar.Section>

      <Navbar.Section
        grow
        component={ScrollArea}
        styles={{
          viewport: {
            "&>*": {
              minWidth: "0 !important",
              display: "block !important",
              maxWidth: "100%",
              width: "100%",
            },
          },
        }}
      >
        <Stack
          spacing={0}
          // direction="column"
          sx={{ maxWidth: "100%", minWidth: 0 }}
        >
          {linkList
            .filter((l: LinkObject) => l.link)
            .map((link: LinkObject) => {
              const active = `/${location.asPath.split("/")[1]}` === link.link;
              const navLinkComponent = (
                <NavLink
                  // py="xs"
                  label={collapsed ? false : <Text inline>{link.name}</Text>}
                  icon={link?.icon && <link.icon size={16} />}
                  active={active}
                  disabled={link.soon}
                  sx={{ maxWidth: "100%", minWidth: 0 }}
                  styles={(theme) => ({
                    icon: {
                      paddingTop: 0,
                      marginTop: theme.spacing.xs / 8,
                      marginBottom: theme.spacing.xs / 8,
                    },
                  })}
                  {...link?.props}
                />
              );
              if (link.soon)
                return (
                  <Tooltip
                    key={link.link}
                    label={link.name}
                    position="right"
                    disabled={!collapsed}
                    withinPortal
                  >
                    <div>{navLinkComponent}</div>
                  </Tooltip>
                );
              return (
                <Tooltip
                  key={link.link}
                  label={link.name}
                  position="right"
                  disabled={!collapsed}
                  withinPortal
                >
                  <div>
                    <Link key={link.link} href={link.link}>
                      {navLinkComponent}
                    </Link>
                  </div>
                </Tooltip>
              );
            })}
        </Stack>
      </Navbar.Section>

      <Navbar.Section
        sx={{
          borderTop: "solid 1px",
          borderColor: dark ? theme.colors.dark[5] : theme.colors.gray[2],
        }}
      >
        <Group
          // spacing={0}
          sx={(theme) => ({
            padding: theme.spacing.xs / 2,
            gap: theme.spacing.xs / 2,
          })}
          position="center"
        >
          {!collapsed && (
            <>
              <UserMenu
                collapsed={collapsed}
                trigger={
                  <ActionIcon
                    color="blue"
                    variant="subtle"
                    // py="xs"
                    sx={{ flexGrow: 1 }}
                  >
                    <Text
                      size="xs"
                      color="blue"
                      sx={{ flexGrow: 1 }}
                      ml="xs"
                      weight={700}
                    >
                      {user.loading
                        ? "Loading"
                        : user.loggedIn
                        ? `@${user?.db?.username}`
                        : "Not logged in"}
                    </Text>
                  </ActionIcon>
                }
              />
            </>
          )}
          <ActionIcon
            onClick={() => {
              // console.log(collapsed);
              toggleCollapsed();
              if (props?.onCollapse) props.onCollapse();
            }}
          >
            {collapsed ? (
              <IconChevronRight size={16} />
            ) : (
              <IconChevronLeft size={16} />
            )}
          </ActionIcon>
        </Group>
      </Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;
