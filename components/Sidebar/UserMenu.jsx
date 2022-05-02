import {
  Menu,
  Group,
  Text,
  Avatar,
  Divider,
  Switch,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { NextLink } from "@mantine/next";

import {
  IconUserCircle,
  IconSettings,
  IconLogout,
  IconMoonStars,
} from "@tabler/icons";

import { appSignOut } from "../../services/firebase";

function UserMenu({ trigger }) {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  return (
    <Menu
      //   size="lg"
      position="top"
      transition="pop"
      control={trigger}
      sx={{
        display: "block",
        width: "100%",
      }}
      closeOnItemClick={false}
    >
      <Menu.Label>Settings</Menu.Label>
      <Menu.Item disabled icon={<IconUserCircle size={14} />}>
        Profile
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          toggleColorScheme();
        }}
        icon={<IconMoonStars size={14} />}
        rightSection={<Switch checked={dark} size="xs" readOnly />}
      >
        Dark Mode
      </Menu.Item>
      <Menu.Item
        component={NextLink}
        href="/settings"
        icon={<IconSettings size={14} />}
      >
        Account settings
      </Menu.Item>
      <Menu.Item onClick={appSignOut} icon={<IconLogout size={14} />}>
        Logout
      </Menu.Item>
    </Menu>
  );
}

export default UserMenu;
