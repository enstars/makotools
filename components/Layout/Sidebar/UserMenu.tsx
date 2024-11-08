import {
  Menu,
  Text,
  Avatar,
  Switch,
  useMantineTheme,
  Box,
  Indicator,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSettings,
  IconLogin,
  IconLogout,
  IconMoonStars,
  IconPalette,
  IconGlobe,
  IconBookmark,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

import { characterColors } from "../../MantineTheme/index";

import useUser from "services/firebase/user";
import { LOCALES } from "services/makotools/locales";
import ProfileAvatar from "pages/[user]/components/profilePicture/ProfileAvatar";
import { useEffect, useRef } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";

function UserMenu({ trigger }: { trigger: any }) {
  const { t } = useTranslation("sidebar");
  const theme = useMantineTheme();
  const dark = theme.colorScheme === "dark";
  const [opened, handlers] = useDisclosure(false);
  const { user, userDB, privateUserDB, updateUserDB, isUserDBPending } =
    useUser();
  const { push, pathname, asPath, query, locale } = useRouter();
  const userMenuAction = useRef<"change-theme">();

  useEffect(() => {
    if (updateUserDB?.isPending) {
      if (userMenuAction.current === "change-theme") {
        showNotification({
          id: "updateTheme",
          loading: true,
          title: "Updating MakoTools theme...",
          message: "This might take some time.",
        });
      }
    } else if (updateUserDB?.isSuccess) {
      updateNotification({
        id: "updateTheme",
        loading: false,
        title: "Successfully updated theme!",
        message: (
          <Text>
            You are now using{" "}
            <Text fw={600}>
              {characterColors.find(
                (color) => color.name === userDB?.user__theme
              )?.display_name ?? ""}
            </Text>
            !
          </Text>
        ),
      });
    } else if (updateUserDB?.isError) {
      updateNotification({
        id: "updateTheme",
        loading: false,
        title: "Updating MakoTools theme...",
        message: "This might take some time.",
      });
    }
  }, [updateUserDB, userDB]);

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
          href={userDB ? `/@${userDB?.username}` : "#"}
          icon={
            userDB ? (
              <ProfileAvatar userInfo={userDB} size={32} />
            ) : (
              <Avatar
                color={theme.primaryColor}
                size="sm"
                radius="xl"
                sx={{ "*": { display: "flex" } }}
              />
            )
          }
        >
          {isUserDBPending ? (
            <Text size="sm" color="dimmed">
              {t("menu.loading")}
            </Text>
          ) : userDB ? (
            <Box
              sx={{
                "*": {
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                },
              }}
            >
              {userDB?.name && (
                <Text id="sidebar-user-name" size="sm" weight={500}>
                  {userDB.name}
                </Text>
              )}
              <Text id="sidebar-user-email" size="xs" color="dimmed" mt={-2}>
                @{userDB?.username}
              </Text>
            </Box>
          ) : (
            <Text size="sm" color="dimmed">
              {t("menu.notLoggedIn")}
            </Text>
          )}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label id="sidebar-label-quick-settings">
          {t("menu.quickSettings")}
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
          {t("menu.darkMode")}
        </Menu.Item>
        {userDB && (
          <Menu.Item
            id="sidebar-user-theme"
            icon={<IconPalette size={14} />}
            closeMenuOnClick={false}
            rightSection={
              <Select
                placeholder="Choose user theme..."
                value={theme.primaryColor}
                onChange={(value) =>
                  updateUserDB?.mutate({ user__theme: value ?? undefined })
                }
                data={characterColors.map((colorTheme) => ({
                  value: colorTheme.name,
                  label: colorTheme.display_name,
                }))}
                rightSectionWidth={0}
                rightSection={<></>}
                styles={(theme) => ({
                  root: {
                    marginRight: -12,
                  },
                  input: {
                    padding: 0,
                    textAlign: "right",
                    border: "none",
                    background: "none",
                    height: "auto",
                    minHeight: 0,
                    lineHeight: 1,
                    color: theme.other.dimmed,
                    paddingRight: 12,
                  },
                  item: {
                    textAlign: "right",
                    padding: "6px 12px",
                  },
                })}
              />
            }
          >
            {t("menu.userTheme")}
          </Menu.Item>
        )}
        <Menu.Item
          icon={<IconGlobe size={14} />}
          closeMenuOnClick={false}
          rightSection={
            <Select
              value={locale}
              onChange={(value) => {
                if (value && value !== locale)
                  push({ pathname, query }, asPath, { locale: value });
              }}
              data={LOCALES.map((locale) => ({
                value: locale.code,
                label: locale.name,
              }))}
              rightSectionWidth={0}
              rightSection={<></>}
              styles={(theme) => ({
                root: {
                  marginRight: -12,
                },
                input: {
                  padding: 0,
                  textAlign: "right",
                  border: "none",
                  background: "none",
                  height: "auto",
                  minHeight: 0,
                  lineHeight: 1,
                  color: theme.other.dimmed,
                  paddingRight: 12,
                },
                item: {
                  textAlign: "right",
                  padding: "6px 12px",
                },
              })}
            />
          }
        >
          {t("menu.locale")}
        </Menu.Item>
        <Menu.Label id="sidebar-label-account">{t("menu.account")}</Menu.Label>

        {isUserDBPending ? (
          <Menu.Item
            className="sidebar-link-login"
            icon={<IconLogin size={14} />}
            disabled
          >
            {t("menu.login")}
          </Menu.Item>
        ) : user?.id ? (
          <>
            <Menu.Item
              component={Link}
              href="/bookmarks"
              icon={<IconBookmark size={14} />}
            >
              {t("menu.bookmarks")}
            </Menu.Item>
            <Menu.Item
              id="sidebar-link-settings"
              component={Link}
              href="/settings"
              icon={
                <Indicator
                  color="red"
                  position="top-start"
                  dot={
                    privateUserDB &&
                    privateUserDB?.friends__receivedRequests?.length !==
                      undefined &&
                    privateUserDB?.friends__receivedRequests?.length > 0
                  }
                >
                  <IconSettings size={14} />
                </Indicator>
              }
            >
              {t("menu.settings")}
            </Menu.Item>
            <Menu.Item
              id="sidebar-link-logout"
              onClick={() => {
                user.signOut().then(() => {
                  push("/");
                });
              }}
              icon={<IconLogout size={14} />}
            >
              {t("menu.logout")}
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
              {t("menu.login")}
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

export default UserMenu;
