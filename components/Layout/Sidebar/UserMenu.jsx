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
import { useUserData } from "../../../services/userData";

import {
  IconUserCircle,
  IconSettings,
  IconLogin,
  IconLogout,
  IconMoonStars,
  IconUser,
} from "@tabler/icons";

import { appSignOut } from "../../../services/firebase";
import { useFirebaseUser } from "../../../services/firebase/user";

function UserMenu({ trigger }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [opened, handlers] = useDisclosure(false);
  const { userData, setUserDataKey } = useUserData();
  const { firebaseUser } = useFirebaseUser();

  //   console.log(theme);
  return (
    <Menu
      size="md"
      position="top"
      transition="pop"
      control={trigger}
      sx={{
        display: "block",
        width: "100%",
        // pointerEvents: userData.loading ? "none" : null,
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
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }}
    >
      <Menu.Item
        icon={
          <Avatar
            color="blue"
            size="sm"
            radius="xl"
            sx={{ "*": { display: "flex" } }}
          ></Avatar>
        }
        sx={{ pointerEvents: "none" }}
      >
        {userData.loading ? (
          <Text size="sm" color="dimmed">
            Loading
          </Text>
        ) : userData.loggedIn ? (
          <Box
            sx={{
              "*": {
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              },
            }}
          >
            <Text size="sm" weight={500}>
              {userData?.name || userData.user.email.split("@")[0]}
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
      </Menu.Item>
      <Divider />
      <Menu.Label>Quick Settings</Menu.Label>
      {/* <Menu.Item disabled icon={<IconUserCircle size={14} />}>
        Profile
      </Menu.Item> */}
      <Menu.Item
        onClick={() => {
          setUserDataKey({ dark_mode: colorScheme !== "dark" });
        }}
        icon={<IconMoonStars size={14} />}
        rightSection={<Switch checked={dark} size="xs" readOnly />}
      >
        Dark Mode
      </Menu.Item>
      <Menu.Label>Account</Menu.Label>

      {userData.loading ? (
        <Menu.Item icon={<IconLogin size={14} />} disabled>
          Log In
        </Menu.Item>
      ) : userData.loggedIn ? (
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
              // appSignOut();
              firebaseUser.user.signOut();
              handlers.close();
            }}
            icon={<IconLogout size={14} />}
          >
            Logout
          </Menu.Item>
        </>
      ) : (
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
