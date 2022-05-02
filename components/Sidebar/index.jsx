import React, { useState, useEffect, forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useUserData } from "../../services/userData";
import { EnsembleSquareLogo } from "../../public/logo_square";
import { motion } from "framer-motion";
import UserMenu from "./UserMenu";

import {
  IconUsers,
  IconPlayCard,
  IconAward,
  IconBooks,
  IconLogin,
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
  ThemeIcon,
} from "@mantine/core";

const SidebarButton = forwardRef(function button({ children, ...props }, ref) {
  return (
    <UnstyledButton
      component="a"
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
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

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      // hidden={!opened}
      width={{ sm: 300 }}
    >
      <Navbar.Section mt="xs">
        <Link href="/">
          <a className="es-sidebar__branding">
            <EnsembleSquareLogo color="white" />
            <span>Ensemble Square</span>
          </a>
        </Link>

        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
      </Navbar.Section>

      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
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
              <Group>
                <ThemeIcon variant="light">
                  <link.icon size={16} />
                </ThemeIcon>
                <Text size="sm">{link.name}</Text>
              </Group>
            </SidebarButton>
          </Link>
        ))}
      </Navbar.Section>

      <Navbar.Section>
        <Box
          sx={{
            paddingTop: theme.spacing.sm,
          }}
        >
          {userData.loading ? (
            "loading"
          ) : userData.loggedIn ? (
            <UserMenu
              trigger={
                <Box
                  sx={(theme) => ({
                    display: "block",
                    width: "100%",
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[0]
                        : theme.black,

                    "&:hover": {
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[6]
                          : theme.colors.gray[0],
                    },
                  })}
                >
                  <Group
                    spacing="sm"
                    sx={{ flexWrap: "nowrap", alignItems: "flex-start" }}
                  >
                    <Avatar color="blue" size="sm" radius="md">
                      {userData.name
                        .match(/(\b\S)?/g)
                        .join("")
                        .split("")
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </Avatar>
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
                        {userData.name}
                      </Text>
                      <Text size="xs" color="dimmed" mt={-2}>
                        @{userData.username}
                      </Text>
                    </Box>
                  </Group>
                </Box>
              }
            />
          ) : (
            <Link href="/login" passHref>
              <SidebarButton>
                <Group>
                  <ThemeIcon variant="light">
                    <IconLogin size={16} />
                  </ThemeIcon>
                  <Text size="sm">Log In</Text>
                </Group>
              </SidebarButton>
            </Link>
          )}
        </Box>
      </Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;
