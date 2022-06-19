import React, { useState, useEffect, forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useUserData } from "../../services/userData";
import UserMenu from "./UserMenu";
import ErrorBoundary from "../ErrorBoundary";
import MakotoolsLight from "../assets/Logo/mkt_light_icon.svg?url";
import MakotoolsDark from "../assets/Logo/mkt_dark_icon.svg?url";
import MakotoolsTextLight from "../assets/Logo/mkt_light_text.svg?url";
import MakotoolsTextDark from "../assets/Logo/mkt_dark_text.svg?url";
import {
  IconUsers,
  IconPlayCard,
  IconAward,
  IconBooks,
  IconLogin,
  IconUser,
} from "@tabler/icons";
import {
  Navbar,
  ScrollArea,
  Group,
  Stack,
  Avatar,
  Text,
  UnstyledButton,
  Box,
  MediaQuery,
  Burger,
  useMantineTheme,
  useMantineColorScheme,
  ThemeIcon,
} from "@mantine/core";

import { useColorScheme } from "@mantine/hooks";

const SidebarButton = forwardRef(function button(
  { children, fullPadding, sx, ...props },
  ref
) {
  return (
    <UnstyledButton
      component="a"
      sx={(theme) => ({
        display: "block",
        // boxSizing: "border-box",
        width: "100%",
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingTop: fullPadding ? theme.spacing.sm : theme.spacing.sm / 2,
        paddingBottom: fullPadding ? theme.spacing.sm : theme.spacing.sm / 2,
        // borderRadius: theme.radius.sm,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[2],
        },

        "@media (max-width: 768px)": {
          padding: theme.spacing.xs,
          // paddingRight: theme.spacing.xs / 2,
        },
        ...sx,
      })}
      ref={ref}
      {...props}
    >
      {children}
    </UnstyledButton>
  );
});

function Sidebar({ opened, setOpened }) {
  const location = useRouter();
  const { userData } = useUserData();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Navbar
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[0],
      }}
      // fixed
      position={{ top: 0, left: 0 }}
      width={{
        sm: 250,
        lg: 300,
        base: 40,
      }}
    >
      <Navbar.Section
        // mb={theme.spacing.xs / 2}
        sx={{
          borderBottom: "solid 1px",
          borderColor: dark ? theme.colors.dark[5] : theme.colors.gray[2],
          marginBottom: theme.spacing.xs / 2,

          "@media (max-width: 768px)": {
            marginBottom: 0,
            // paddingRight: theme.spacing.xs / 2,
          },
        }}
      >
        <Link href="/" passHref>
          <SidebarButton fullPadding>
            <MediaQuery
              query="(max-width: 768px)"
              styles={{ justifyContent: "center" }}
            >
              <Group spacing={0}>
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
                <MediaQuery
                  query="(max-width: 768px)"
                  styles={{ display: "none" }}
                >
                  <Box ml="xs" sx={{ display: "flex" }}>
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
                </MediaQuery>
              </Group>
            </MediaQuery>
          </SidebarButton>
        </Link>
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
            },
            {
              link: "/stories",
              name: "Stories",
              icon: IconBooks,
            },
          ].map((link) => (
            <Link key={link.link} href={link.link} passHref>
              <SidebarButton
                sx={
                  `/${location.asPath.split("/")[1]}` === link.link
                    ? {
                        backgroundColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[1],
                      }
                    : {}
                }
              >
                <MediaQuery
                  query="(max-width: 768px)"
                  styles={{ justifyContent: "center" }}
                >
                  <Group spacing={0}>
                    <Box sx={{ display: "flex" }}>
                      <link.icon size={16} />
                    </Box>
                    <MediaQuery
                      query="(max-width: 768px)"
                      styles={{
                        display: "none",
                      }}
                    >
                      <Text
                        ml="md"
                        size="sm"
                        weight={
                          `/${location.asPath.split("/")[1]}` === link.link
                            ? "700"
                            : "500"
                        }
                      >
                        {link.name}
                      </Text>
                    </MediaQuery>
                  </Group>
                </MediaQuery>
              </SidebarButton>
            </Link>
          ))}
        </Group>
      </Navbar.Section>

      <Navbar.Section
        sx={{
          borderTop: "solid 1px",
          borderColor: dark ? theme.colors.dark[5] : theme.colors.gray[2],
        }}
        // mt="sm"
      >
        <Box>
          <UserMenu
            trigger={
              <SidebarButton component="div" fullPadding>
                <MediaQuery
                  query="(max-width: 768px)"
                  styles={{ justifyContent: "center" }}
                >
                  <Group
                    spacing="sm"
                    sx={{ flexWrap: "nowrap", alignItems: "flex-start" }}
                  >
                    <Avatar color="blue" size="sm" radius="xl">
                      <IconUser size={16} />
                    </Avatar>

                    <MediaQuery
                      query="(max-width: 768px)"
                      styles={{ display: "none" }}
                    >
                      {userData.loading ? (
                        <Text size="sm" color="dimmed">
                          Loading
                        </Text>
                      ) : userData.loggedIn ? (
                        <Box sx={{ minWidth: 0 }}>
                          <Text
                            size="sm"
                            weight={500}
                            sx={{
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                            }}
                          >
                            {userData?.name ||
                              userData.user.email.split("@")[0]}
                          </Text>
                          <Text size="xs" color="dimmed" mt={-2}>
                            {userData.username
                              ? `@${userData.username}`
                              : userData.user.email}
                          </Text>
                        </Box>
                      ) : (
                        <Text size="sm" color="dimmed">
                          Not Logged In
                        </Text>
                      )}
                    </MediaQuery>
                  </Group>
                </MediaQuery>
              </SidebarButton>
            }
          />
        </Box>
      </Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;
