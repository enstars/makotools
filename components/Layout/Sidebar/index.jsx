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
import {
  IconUsers,
  IconPlayCard,
  IconAward,
  IconBooks,
  IconUser,
  IconDotsCircleHorizontal,
  IconChevronRight,
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

  const [collapsed, toggleCollapsed] = useToggle(false, [true, false]);
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
          marginBottom: false ? 0 : theme.spacing.xs / 2,
        }}
      >
        <Group spacing={0} sx={{ flexWrap: "nowrap", alignItems: "stretch" }}>
          {!collapsed && (
            <SidebarButton
              collapsed={collapsed}
              link="/"
              rootStyles={{ root: { flexGrow: 1 } }}
            >
              <Group
                spacing={0}
                sx={{ justifyContent: "center", flexWrap: "nowrap" }}
              >
                <Image
                  src={
                    theme.colorScheme === "dark"
                      ? MakotoolsDark
                      : MakotoolsLight
                  }
                  alt="MakoTools site logo"
                  width={20}
                  height={20}
                  objectFit="contain"
                />
                {!collapsed && (
                  <Box ml="xs" sx={{ display: "flex", flexGrow: 1 }}>
                    <Image
                      src={
                        theme.colorScheme === "dark"
                          ? MakotoolsTextDark
                          : MakotoolsTextLight
                      }
                      alt="MakoTools site name"
                      width={120}
                      height={20}
                      objectFit="contain"
                      objectPosition="left"
                    />
                  </Box>
                )}
              </Group>
            </SidebarButton>
          )}
          <SidebarButton
            component="button"
            onClick={() => {
              toggleCollapsed();
              if (props?.onCollapse) props.onCollapse();
            }}
            px={0}
            rootStyles={{ root: { flex: "0 0 40px" } }}
            styles={(theme) => ({
              label: {
                justifyContent: "center",
                minHeight: 20,
                transform: `rotate(${collapsed ? 0 : 180}deg)`,
              },
            })}
          >
            <IconChevronRight size={18} />
          </SidebarButton>
        </Group>
      </Navbar.Section>

      <Navbar.Section grow component={ScrollArea}>
        <Group spacing={0} direction="column">
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
          ].map((link) => (
            <SidebarButton
              key={link.link}
              collapsed={collapsed}
              active={`/${location.asPath.split("/")[1]}` === link.link}
              contents={{ ...link }}
              link={link.soon ? undefined : link.link}
            />
          ))}
        </Group>
        {!collapsed && (
          <Box p="xs">
            <SupportBanner />
          </Box>
        )}
      </Navbar.Section>

      <Navbar.Section
        sx={{
          borderTop: "solid 1px",
          borderColor: dark ? theme.colors.dark[5] : theme.colors.gray[2],
        }}
      >
        <Box>
          <UserMenu
            trigger={
              <SidebarButton
                collapsed={collapsed}
                component="div"
                contents={{
                  name: "More",
                  icon: IconDotsCircleHorizontal,
                }}
              />
            }
          />
        </Box>
      </Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;
