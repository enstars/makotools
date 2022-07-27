import React, { forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "next/router";
import UserMenu from "./UserMenu";
import ErrorBoundary from "../../ErrorBoundary";
import MakotoolsLight from "../../../assets/Logo/mkt_light_icon.svg?url";
import MakotoolsDark from "../../../assets/Logo/mkt_dark_icon.svg?url";
import MakotoolsTextLight from "../../../assets/Logo/mkt_light_text.svg?url";
import MakotoolsTextDark from "../../../assets/Logo/mkt_dark_text.svg?url";
import MakotoolsLightComponent from "../../../assets/Logo/mkt_light_icon.svg";
import MakotoolsDarkComponent from "../../../assets/Logo/mkt_dark_icon.svg";
import MakotoolsTextLightComponent from "../../../assets/Logo/mkt_light_text.svg";
import MakotoolsTextDarkComponent from "../../../assets/Logo/mkt_dark_text.svg";
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
} from "@mantine/core";
import { useColorScheme, useToggle } from "@mantine/hooks";
import SupportBanner from "../SupportBanner";

const SidebarButton = forwardRef(function button(
  { contents, link, rootStyles, ...props },
  ref
) {
  const { collapsed } = props;
  const Label = (props) =>
    contents ? (
      <Text inline weight={500} sx={{ flexGrow: 1 }} {...props}>
        {contents.name}{" "}
        {contents.soon && (
          <Badge size="xs" variant="outline">
            Soon
          </Badge>
        )}
      </Text>
    ) : null;
  const StyledButton = forwardRef(function button(
    { children, sx, collapsed, active, ...props2 },
    fref
  ) {
    return (
      <Button
        variant={active ? "light" : "subtle"}
        component="a"
        color={active ? "blue" : "dark"}
        radius={0}
        sx={(theme) => [
          {
            display: "block",
            height: "auto",
            width: "100%",
            paddingLeft: collapsed ? theme.spacing.xs : theme.spacing.md,
            paddingRight: collapsed ? theme.spacing.xs : theme.spacing.md,
            paddingTop: theme.spacing.sm,
            paddingBottom: theme.spacing.sm,
            pointerEvents: active ? "none" : "auto",
            border: 0,
          },
          sx,
        ]}
        styles={{
          inner: {
            display: "block",
          },
        }}
        {...props2}
        ref={fref}
      >
        {contents ? (
          <Group
            spacing={0}
            sx={{ justifyContent: "center", opacity: contents.soon ? 0.5 : 1 }}
          >
            <Box sx={{ display: "flex" }}>
              <contents.icon size={18} />
            </Box>
            {!collapsed && <Label ml="sm" />}
          </Group>
        ) : (
          children
        )}
      </Button>
    );
  });

  const TooltipProps = {
    opened: contents ? (collapsed ? undefined : false) : false,
    label: <Label inherit />,
    position: "right",
    withArrow: true,
    styles: rootStyles,
    ref: ref,
    sx: {
      display: "block",
      width: "100%",
    },
  };
  if (link)
    return (
      <Tooltip {...TooltipProps}>
        <Link href={link} passHref>
          <StyledButton {...props} />
        </Link>
      </Tooltip>
    );
  return (
    <Tooltip {...TooltipProps}>
      <StyledButton {...props} />
    </Tooltip>
  );
});

function Sidebar(props) {
  const location = useRouter();

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const [collapsed, toggleCollapsed] = useToggle([false, true]);
  console.log("collapsed", collapsed);
  if (props.permanentlyExpanded && collapsed) toggleCollapsed();
  return (
    <Navbar
      // fixed
      position={{ top: 0, left: 0 }}
      width={{
        base: 0,
        xs: collapsed ? 40 : 250,
      }}
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
        zIndex: 210,
      }}
      {...props}
    >
      <Navbar.Section
        sx={{
          borderBottom: "solid 1px",
          borderColor: dark ? theme.colors.dark[5] : theme.colors.gray[2],
          // marginBottom: false ? 0 : theme.spacing.xs / 2,
        }}
      >
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
          {[
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
            {
              link: "https://www.patreon.com/makotools",
              name: "Patreon",
              // icon: IconBrandPatreon,
              props: {
                // active: true,
                color: "orange",
                variant: "subtle",
                icon: (
                  <IconBrandPatreon size={16} color={theme.colors.orange[5]} />
                ),
                description: collapsed ? null : "Support us!",
              },
            },
          ].map((link) => {
            const navLinkComponent = (
              <NavLink
                py="xs"
                label={collapsed ? false : <Text inline>{link.name}</Text>}
                icon={<link.icon size={16} />}
                active={`/${location.asPath.split("/")[1]}` === link.link}
                link={link.soon ? undefined : link.link}
                disabled={link.soon}
                sx={{ maxWidth: "100%", minWidth: 0 }}
                styles={collapsed && { icon: { margin: 0 } }}
                {...link?.props}
              />
            );
            if (link.soon) return <>{navLinkComponent}</>;
            return (
              <Link key={link.link} href={link.link}>
                {navLinkComponent}
              </Link>
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
        <UserMenu
          trigger={
            <NavLink
              // py="xs"
              label={"Settings"}
              icon={<IconSettings size={16} />}
            />
          }
        />
        <NavLink
          onClick={() => {
            console.log(collapsed);
            toggleCollapsed();
            if (props?.onCollapse) props.onCollapse();
          }}
          label={!collapsed && <Text inline>Collapse</Text>}
          icon={
            collapsed ? (
              <IconChevronRight size={16} />
            ) : (
              <IconChevronLeft size={16} />
            )
          }
        />
      </Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;
