import React, { forwardRef, ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IconUsers,
  IconCards,
  IconAward,
  IconBooks,
  IconBrandPatreon,
  IconUserCircle,
  TablerIcon,
  IconCalendar,
  IconDiamond,
  IconInfoCircle,
  IconChevronRight,
  IconChevronLeft,
} from "@tabler/icons";
import {
  Navbar,
  ScrollArea,
  Group,
  Text,
  Box,
  useMantineTheme,
  Tooltip,
  NavLink,
  Stack,
  NavLinkProps,
  ActionIcon,
} from "@mantine/core";

import MakotoolsLightComponent from "../../../assets/Logo/mkt_light_icon.svg";
import MakotoolsDarkComponent from "../../../assets/Logo/mkt_dark_icon.svg";
import MakotoolsTextLightComponent from "../../../assets/Logo/mkt_light_text.svg";
import MakotoolsTextDarkComponent from "../../../assets/Logo/mkt_dark_text.svg";
import useUser from "../../../services/firebase/user";
import { useSidebarStatus } from "..";

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
      component?: any;
      href?: string;
    },
  ref
) {
  const theme = useMantineTheme();
  return (
    <NavLink
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
  const dark = theme.colorScheme === "dark";
  const user = useUser();

  const { collapsed, toggleCollapsed } = useSidebarStatus();
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
      Icon: IconCards,
    },
    {
      link: "/events",
      name: "Events",
      Icon: IconAward,
    },
    {
      link: "/scouts",
      name: "Scouts",
      Icon: IconDiamond,
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
    {
      link: "/about",
      name: "About",
      Icon: IconInfoCircle,
    },
    {
      link: "https://www.patreon.com/makotools",
      name: "Patreon",
      Icon: IconBrandPatreon,
    },
  ];
  return (
    <Navbar
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
        sx={(theme) => ({
          padding: theme.spacing.xs / 2,
          maxWidth: "100%",
          minWidth: 0,
        })}
      >
        <SidebarLink
          collapsed={collapsed}
          component={Link}
          href="/"
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
                      <SidebarLink
                        component={Link}
                        href={link.link}
                        collapsed={collapsed}
                        active={active}
                        {...link}
                      />
                    )}
                  </div>
                </Tooltip>
              );
            })}

          <Group
            sx={(theme) => ({
              padding: theme.spacing.xs / 2,
              gap: 0,
            })}
            position="center"
            p={0}
          >
            {!collapsed && <></>}
          </Group>
          <UserMenu
            trigger={
              <SidebarLink
                collapsed={collapsed}
                active={true}
                name="User"
                Icon={IconUserCircle}
                sx={{ "&&": { flex: "1 1 0" } }}
                props={{ variant: "subtle" }}
              />
            }
          />
          {collapsed ? (
            <Group position="right" p={0}>
              <ActionIcon
                size={40}
                radius="sm"
                onClick={() => {
                  toggleCollapsed();
                  if (props?.onCollapse) props.onCollapse();
                }}
                // variant="light"
              >
                <Text inline color="dimmed">
                  <IconChevronRight size={20} />
                </Text>
              </ActionIcon>
            </Group>
          ) : (
            <Group position="right" p={0}>
              <ActionIcon
                size={40}
                // radius="sm"
                onClick={() => {
                  toggleCollapsed();
                  if (props?.onCollapse) props.onCollapse();
                }}
                variant="default"
                mr={-6}
                sx={(theme) => ({
                  borderRadius: 0,
                  borderTopLeftRadius: theme.radius.md,
                  borderBottomLeftRadius: theme.radius.md,
                  width: 100,
                })}
              >
                <Text component={Group} color="dimmed" spacing={4}>
                  <IconChevronLeft size={16} />
                  <Text inline size="sm" weight={500}>
                    Collapse
                  </Text>
                </Text>
              </ActionIcon>
            </Group>
          )}
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;
