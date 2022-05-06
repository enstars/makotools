import React, { useState, useEffect, forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useUserData } from "../../services/userData";
import { EnsembleSquareLogo } from "../../public/logo_square";
import UserMenu from "./UserMenu";
import ErrorBoundary from "../ErrorBoundary";

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
  { children, fullPadding, ...props },
  ref
) {
  return (
    <UnstyledButton
      component="a"
      sx={(theme) => ({
        display: "block",
        // boxSizing: "border-box",
        width: "100%",
        paddingLeft: theme.spacing.sm,
        paddingRight: theme.spacing.sm,
        paddingTop: fullPadding ? theme.spacing.xs : theme.spacing.xs / 2,
        paddingBottom: fullPadding ? theme.spacing.xs : theme.spacing.xs / 2,
        // borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[1],
        },
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
        base: 56,
      }}
    >
      <Navbar.Section
        mb={theme.spacing.xs / 2}
        sx={{
          borderBottom: "solid 1px",
          borderColor: dark ? theme.colors.dark[5] : theme.colors.gray[2],
        }}
      >
        <Link href="/" passHref>
          <SidebarButton fullPadding>
            <MediaQuery
              query="(max-width: 768px)"
              styles={{ justifyContent: "center" }}
            >
              <Group spacing="sm">
                <ThemeIcon
                  variant={location.asPath === "/" ? "filled" : "light"}
                >
                  <EnsembleSquareLogo />
                </ThemeIcon>
                <MediaQuery
                  query="(max-width: 768px)"
                  styles={{
                    display: "none",
                  }}
                >
                  <Text
                    size="sm"
                    weight={location.asPath === "/" ? "700" : "500"}
                    sx={{ fontFamily: theme.headings.fontFamily }}
                  >
                    Ensemble Square
                  </Text>
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
              <SidebarButton>
                <MediaQuery
                  query="(max-width: 768px)"
                  styles={{ justifyContent: "center" }}
                >
                  <Group spacing="sm">
                    <ThemeIcon
                      variant={
                        `/${location.asPath.split("/")[1]}` === link.link
                          ? "filled"
                          : "light"
                      }
                    >
                      <link.icon size={16} />
                    </ThemeIcon>
                    <MediaQuery
                      query="(max-width: 768px)"
                      styles={{
                        display: "none",
                      }}
                    >
                      <Text
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
              <Box
                sx={(theme) => ({
                  display: "block",
                  width: "100%",
                  padding: theme.spacing.xs,
                  // borderRadius: theme.radius.sm,
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[0]
                      : theme.black,

                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[8]
                        : theme.colors.gray[1],
                  },
                })}
              >
                <MediaQuery
                  query="(max-width: 768px)"
                  styles={{ justifyContent: "center" }}
                >
                  <Group
                    spacing="sm"
                    sx={{ flexWrap: "nowrap", alignItems: "flex-start" }}
                  >
                    <Avatar color="blue" size="sm" radius="md">
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
              </Box>
            }
          />
        </Box>
      </Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;
