import {
  Menu,
  Group,
  Text,
  Avatar,
  Divider,
  useMantineTheme,
} from "@mantine/core";
import { NextLink } from "@mantine/next";

import { IconUserCircle, IconSettings, IconLogout } from "@tabler/icons";

import { appSignOut } from "../../services/firebase";

function UserMenu({ trigger }) {
  const theme = useMantineTheme();
  return (
    <Menu
      //   size="sm"
      position="top"
      transition="pop"
      control={trigger}
      sx={{
        display: "block",
        width: "100%",
      }}
    >
      <Menu.Label>Settings</Menu.Label>
      <Menu.Item disabled icon={<IconUserCircle size={14} />}>
        Profile
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
