import {
  Menu,
  Group,
  Text,
  Avatar,
  Divider,
  Switch,
  useMantineTheme,
  useMantineColorScheme,
  MediaQuery,
  Box,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

import {
  IconCircleCheck,
  IconUserCircle,
  IconSettings,
  IconLogin,
  IconLogout,
  IconMoonStars,
  IconUser,
} from "@tabler/icons";

import { useFirebaseUser } from "../../../services/firebase/user";

function UserMenu({ trigger }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [opened, handlers] = useDisclosure(false);
  const { firebaseUser } = useFirebaseUser();

  return (
    <Menu
      id="sidebar-menu"
      size="md"
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
      styles={{
        body: { position: "relative", left: theme.spacing.xs },
        itemBody: {
          maxWidth: "100%",
          minWidth: 0,
        },
        itemLabel: {
          maxWidth: "100%",
          minWidth: 0,
        },
      }}
    >
      <Menu.Item
        id="sidebar-logged-in"
        icon={
          <Avatar
            color="blue"
            size="sm"
            radius="xl"
            sx={{ "*": { display: "flex" } }}
          ></Avatar>
        }
        sx={{
          pointerEvents: "none",
        }}
      >
        {firebaseUser.loading ? (
          <Text size="sm" color="dimmed">
            Loading
          </Text>
        ) : firebaseUser.loggedIn ? (
          <Box
            sx={{
              "*": {
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              },
            }}
          >
            <Text id="sidebar-user-name" size="sm" weight={500}>
              {firebaseUser.firestore?.name ||
                firebaseUser.user.email.split("@")[0]}
            </Text>
            <Text id="sidebar-user-email" size="xs" color="dimmed" mt={-2}>
              {firebaseUser.firestore?.username
                ? `@${firebaseUser.firestore?.username}`
                : firebaseUser.user.email}
            </Text>
          </Box>
        ) : (
          <Text size="sm" color="dimmed">
            Not Logged In
          </Text>
        )}
      </Menu.Item>
      <Divider />
      <Menu.Label id="sidebar-label-quick-settings">Quick Settings</Menu.Label>
      {/* <Menu.Item disabled icon={<IconUserCircle size={14} />}>
        Profile
      </Menu.Item> */}
      <Menu.Item
        id="sidebar-dark-mode"
        onClick={() => {
          theme.other.toggleAppColorScheme();
        }}
        icon={<IconMoonStars size={14} />}
        rightSection={<Switch checked={dark} size="xs" readOnly />}
      >
        Dark Mode
      </Menu.Item>
      <Menu.Label id="sidebar-label-account">Account</Menu.Label>

      {firebaseUser.loading ? (
        <Menu.Item className="sidebar-link-login" icon={<IconLogin size={14} />} disabled>
          Log In
        </Menu.Item>
      ) : firebaseUser.loggedIn ? (
        <>
          <Menu.Item
            id="sidebar-link-settings"
            component={NextLink}
            href="/settings"
            icon={<IconSettings size={14} />}
            onClick={handlers.close}
          >
            Settings
          </Menu.Item>
          <Menu.Item
            id="sidebar-link-logout"
            onClick={() => {
              firebaseUser.user.signOut();
              handlers.close();
              showNotification({
                message: "Successfully signed out",
                autoClose: 5000,
                icon: <IconCircleCheck />,
                className: "signout-notification",
                color: "lime"
              })
            }}
            icon={<IconLogout size={14} />}
          >
            Logout
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item
            className="sidebar-link-login"
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
