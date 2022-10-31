import {
  Menu,
  Text,
  Avatar,
  Switch,
  useMantineTheme,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSettings,
  IconLogin,
  IconLogout,
  IconMoonStars,
} from "@tabler/icons";
import { useRouter } from "next/router";
import Link from "next/link";

import useUser from "../../../services/firebase/user";

function UserMenu({ trigger }: { trigger: any }) {
  const theme = useMantineTheme();
  const dark = theme.colorScheme === "dark";
  const [opened, handlers] = useDisclosure(false);
  const user = useUser();
  const { reload } = useRouter();

  return (
    <Menu
      id="sidebar-menu"
      width={200}
      position="top-start"
      transition="pop"
      shadow="sm"
      closeOnItemClick={true}
      opened={opened}
      onOpen={handlers.open}
      onClose={handlers.close}
      styles={{
        itemLabel: {
          maxWidth: "100%",
          minWidth: 0,
          lineHeight: 1.15,
        },
      }}
      withinPortal
    >
      <Menu.Target>{trigger}</Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          component={Link}
          href={user.loggedIn ? `/@${user?.db?.username}` : "#"}
          icon={
            <Avatar
              color="blue"
              size="sm"
              radius="xl"
              sx={{ "*": { display: "flex" } }}
            />
          }
        >
          {user.loading ? (
            <Text size="sm" color="dimmed">
              Loading
            </Text>
          ) : user.loggedIn ? (
            user.db ? (
              <Box
                sx={{
                  "*": {
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  },
                }}
              >
                {user.db?.name && (
                  <Text id="sidebar-user-name" size="sm" weight={500}>
                    {user.db.name}
                  </Text>
                )}
                <Text id="sidebar-user-email" size="xs" color="dimmed" mt={-2}>
                  @{user?.db?.username}
                </Text>
              </Box>
            ) : (
              <Text size="sm" color="dimmed">
                Unable to load user data
              </Text>
            )
          ) : (
            <Text size="sm" color="dimmed">
              Not Logged In
            </Text>
          )}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label id="sidebar-label-quick-settings">
          Quick Settings
        </Menu.Label>
        <Menu.Item
          id="sidebar-dark-mode"
          onClick={() => {
            theme.other.toggleAppColorScheme();
          }}
          icon={<IconMoonStars size={14} />}
          rightSection={
            <Switch
              sx={{ pointerEvents: "none" }}
              checked={dark}
              size="xs"
              readOnly
            />
          }
          closeMenuOnClick={false}
        >
          Dark Mode
        </Menu.Item>
        <Menu.Label id="sidebar-label-account">Account</Menu.Label>

        {user.loading ? (
          <Menu.Item
            className="sidebar-link-login"
            icon={<IconLogin size={14} />}
            disabled
          >
            Log In
          </Menu.Item>
        ) : user.loggedIn ? (
          <>
            <Menu.Item
              id="sidebar-link-settings"
              component={Link}
              href="/settings"
              icon={<IconSettings size={14} />}
            >
              Settings
            </Menu.Item>
            <Menu.Item
              id="sidebar-link-logout"
              onClick={() => {
                user.user.signOut();
                reload();
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
              component={Link}
              href="/login"
              icon={<IconLogin size={14} />}
            >
              Log In
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

export default UserMenu;
