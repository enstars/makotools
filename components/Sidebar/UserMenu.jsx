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
import { useDisclosure } from "@mantine/hooks";
import { useUserData } from "../../services/userData";

import {
  IconUserCircle,
  IconSettings,
  IconLogin,
  IconLogout,
  IconMoonStars,
} from "@tabler/icons";

import { appSignOut } from "../../services/firebase";

function UserMenu({ trigger }) {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [opened, handlers] = useDisclosure(false);
  const { userData } = useUserData();

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
      gutter={0}
      opened={opened}
      onOpen={handlers.open}
      onClose={handlers.close}
      styles={{ body: { position: "relative", left: theme.spacing.xs } }}
    >
      <Menu.Label>Settings</Menu.Label>
      {/* <Menu.Item disabled icon={<IconUserCircle size={14} />}>
        Profile
      </Menu.Item> */}
      <Menu.Item
        onClick={() => {
          toggleColorScheme();
        }}
        icon={<IconMoonStars size={14} />}
        rightSection={<Switch checked={dark} size="xs" readOnly />}
      >
        Dark Mode
      </Menu.Item>
      <Menu.Label>Account</Menu.Label>

      {!userData.loading && userData.loggedIn && (
        <>
          <Menu.Item
            component={NextLink}
            href="/settings"
            icon={<IconSettings size={14} />}
            onClick={handlers.close}
          >
            Settings
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              appSignOut();
              handlers.close();
            }}
            icon={<IconLogout size={14} />}
          >
            Logout
          </Menu.Item>
        </>
      )}
      {!userData.loading && !userData.loggedIn && (
        <>
          <Menu.Item
            component={NextLink}
            href="/login"
            icon={<IconLogin size={14} />}
            onClick={handlers.close}
          >
            Log In
          </Menu.Item>
        </>
      )}
    </Menu>
  );
}

export default UserMenu;
