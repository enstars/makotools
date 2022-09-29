import { UrlObject } from "url";

import React, {
  ComponentProps,
  ComponentPropsWithRef,
  forwardRef,
  ReactElement,
} from "react";
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
  IconAt,
  IconCalendar,
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
  ThemeIcon,
  NavLinkProps,
} from "@mantine/core";
import { useColorScheme, useToggle } from "@mantine/hooks";
import { StringNullableChain } from "lodash";

import MakotoolsLightComponent from "../../../assets/Logo/mkt_light_icon.svg";
import MakotoolsDarkComponent from "../../../assets/Logo/mkt_dark_icon.svg";
import MakotoolsTextLightComponent from "../../../assets/Logo/mkt_light_text.svg";
import MakotoolsTextDarkComponent from "../../../assets/Logo/mkt_dark_text.svg";
import useUser from "../../../services/firebase/user";

import UserMenu from "./UserMenu";

type LinkObject = {
  link: string;
  name: string;
  Icon?: TablerIcon | ReactElement;
  disabled?: boolean;
  props?: any;
};

const SidebarLink = forwardRef(function SbL(
  {
    collapsed,
    name,
    Icon,
    disabled,
    active,
    props,
    sx,
    ...rest
  }: Omit<LinkObject, "link" | "name"> &
    NavLinkProps & {
      name?: any;
      active?: boolean;
      collapsed: boolean;
      component?: string;
    },
  ref
) {
  const theme = useMantineTheme();
  const xxs = theme.spacing.xs / 1.5;
  return (
    <NavLink
      // py="xs"
      ref={ref}
      label={
        collapsed ? (
          false
        ) : (
          <Text size="md" weight={500} inline>
            {name}
          </Text>
        )
      }
      icon={
        Icon && (
          <Box
            sx={(theme) => ({
              width: 40 - theme.spacing.xs * 2,
              height: 40 - theme.spacing.xs * 2,
              display: "grid",
              placeItems: "center",
            })}
          >
            {typeof Icon === "function" ? <Icon size={18} /> : Icon}
          </Box>
        )
      }
      active={active}
      disabled={disabled}
      sx={(theme) => ({
        maxWidth: "100%",
        minWidth: 0,
        padding: theme.spacing.xs,
        lineHeight: 1,
        borderRadius: theme.radius.sm,
        ...sx,
      })}
      styles={(theme) => ({
        icon: {
          paddingTop: 0,
          marginRight: theme.spacing.xs,
          // marginTop: theme.spacing.xs / 8,
          // marginBottom: theme.spacing.xs / 8,
        },
      })}
      {...props}
      {...rest}
    />
  );
});

function Sidebar(props: any) {
  const location = useRouter();

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const user = useUser();

  const [collapsed, toggleCollapsed] = useToggle([false, true]);
  // console.log("collapsed", collapsed);
  if (props.permanentlyExpanded && collapsed) toggleCollapsed();

  const linkList: LinkObject[] = [
    {
      link: "/characters",
      name: "Characters",
      Icon: IconUsers,
    },
    {
      link: "/cards",
      name: "Cards",
      Icon: IconPlayCard,
    },
    {
      link: "/events",
      name: "Events",
      Icon: IconAward,
      disabled: true,
    },
    {
      link: "/stories",
      name: "Stories",
      Icon: IconBooks,
      disabled: true,
    },
    {
      link: "/calendar",
      name: "Calendar",
      Icon: IconCalendar,
    },
    ...[
      !user.loading && user.loggedIn
        ? {
            link: `/@${user?.db?.username}`,
            name: "Profile",
            Icon: IconUserCircle,
          }
        : {
            link: "",
            name: "",
          },
    ],
    {
      link: "https://www.patreon.com/makotools",
      name: "Patreon",
      Icon: IconBrandPatreon,
    },
  ];
  return (
    <Navbar
      // fixed
      position={{ top: 0, left: 0 }}
      width={{
        base: 0,
        xs: collapsed ? 50 : 250,
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
        boxSizing: "content-box",
      }}
      {...props}
    >
      <Navbar.Section
        // direction="column"
        sx={(theme) => ({
          padding: theme.spacing.xs / 2,
          maxWidth: "100%",
          minWidth: 0,
        })}
      >
        <Link href="/" passHref>
          <SidebarLink
            collapsed={collapsed}
            component="a"
            // py="xs"
            label={
              !collapsed && (
                <Box sx={{ height: 18, display: "flex" }}>
                  {theme.colorScheme === "light" ? (
                    <MakotoolsTextLightComponent
                      viewBox="0 0 1753 281"
                      width={100}
                      height={18}
                    />
                  ) : (
                    <MakotoolsTextDarkComponent
                      viewBox="0 0 1753 281"
                      width={100}
                      height={18}
                    />
                  )}
                </Box>
              )
            }
            Icon={
              theme.colorScheme === "light" ? (
                <MakotoolsLightComponent
                  viewBox="0 0 281 281"
                  width={18}
                  height={18}
                />
              ) : (
                <MakotoolsDarkComponent
                  viewBox="0 0 281 281"
                  width={18}
                  height={18}
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
        scrollbarSize={4}
      >
        <Stack
          spacing={0}
          // direction="column"
          sx={(theme) => ({
            padding: theme.spacing.xs / 2,
            paddingTop: 0,
            maxWidth: "100%",
            minWidth: 0,
          })}
        >
          {linkList
            .filter((l: LinkObject) => l.link)
            .map((link: LinkObject) => {
              const active = `/${location.asPath.split("/")[1]}` === link.link;
              return (
                <Tooltip
                  key={link.link}
                  label={link.name}
                  position="right"
                  disabled={!collapsed}
                  withinPortal
                >
                  <div>
                    {link.disabled ? (
                      <SidebarLink
                        collapsed={collapsed}
                        active={active}
                        {...link}
                      />
                    ) : (
                      <Link key={link.link} href={link.link}>
                        <SidebarLink
                          collapsed={collapsed}
                          active={active}
                          {...link}
                        />
                      </Link>
                    )}
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
            gap: 0,
          })}
          position="center"
        >
          {!collapsed && (
            <>
              <UserMenu
                collapsed={collapsed}
                trigger={
                  <SidebarLink
                    collapsed={collapsed}
                    active={true}
                    name={
                      user.loading
                        ? "Loading"
                        : user.loggedIn
                        ? user?.db?.username
                        : "Not logged in"
                    }
                    Icon={IconAt}
                    sx={{ "&&": { flex: "1 1 0" } }}
                    props={{ variant: "subtle" }}
                  />
                }
              />
            </>
          )}
          <ActionIcon
            size={40}
            radius="sm"
            onClick={() => {
              // console.log(collapsed);
              toggleCollapsed();
              if (props?.onCollapse) props.onCollapse();
            }}
          >
            {collapsed ? (
              <IconChevronRight size={20} />
            ) : (
              <IconChevronLeft size={20} />
            )}
          </ActionIcon>
        </Group>
      </Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;
