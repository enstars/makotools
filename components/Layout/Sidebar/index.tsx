import React, { forwardRef, SyntheticEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IconUsers,
  IconCards,
  IconAward,
  IconBooks,
  IconBrandPatreon,
  IconUserCircle,
  IconCalendar,
  IconDiamond,
  IconInfoCircle,
  IconChevronRight,
  IconChevronLeft,
  IconSearch,
  IconX,
  TablerIconsProps,
  IconExternalLink,
  IconPhoto,
  IconMusic,
} from "@tabler/icons-react";
import {
  Navbar,
  ScrollArea,
  Group,
  Text,
  Box,
  useMantineTheme,
  Tooltip,
  NavLink,
  Stack,
  NavLinkProps,
  ActionIcon,
  TextInput,
  Indicator,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { clamp } from "lodash";
import useTranslation from "next-translate/useTranslation";

import { useSidebarStatus } from "..";

import UserMenu from "./UserMenu";
import SearchResults from "./SearchResults";

import MakotoolsLightComponent from "assets/Logo/mkt_light_icon.svg";
import MakotoolsDarkComponent from "assets/Logo/mkt_dark_icon.svg";
import MakotoolsTextLightComponent from "assets/Logo/mkt_light_text.svg";
import MakotoolsTextDarkComponent from "assets/Logo/mkt_dark_text.svg";
import useUser from "services/firebase/user";

type LinkObject = {
  link: string;
  name: string;
  Icon?: ((props: TablerIconsProps) => JSX.Element) | any;
  disabled?: boolean;
  props?: any;
};

const SidebarLink = forwardRef(function SbL(
  {
    collapsed = false,
    name,
    Icon,
    disabled,
    active,
    props,
    sx,
    ...rest
  }: Omit<LinkObject, "link" | "name"> &
    NavLinkProps & {
      name?: any;
      active?: boolean;
      collapsed?: boolean;
      component?: any;
      href?: string;
    },
  ref
) {
  return (
    <NavLink
      ref={ref}
      label={
        collapsed ? (
          false
        ) : (
          <Text size="md" weight={500} inline>
            {name}
          </Text>
        )
      }
      icon={
        Icon && (
          <Box
            sx={(theme) => ({
              width: 40 - theme.spacing.xs * 2,
              height: 40 - theme.spacing.xs * 2,
              display: "grid",
              placeItems: "center",
            })}
          >
            {Icon.render ? <Icon size={18} /> : Icon}
          </Box>
        )
      }
      active={active}
      disabled={disabled}
      sx={(theme) => ({
        maxWidth: "100%",
        minWidth: 0,
        padding: theme.spacing.xs,
        lineHeight: 1.25,
        borderRadius: theme.radius.sm,
        ...sx,
      })}
      styles={(theme) => ({
        icon: {
          paddingTop: 0,
          marginRight: theme.spacing.xs,
        },
      })}
      {...props}
      {...rest}
    />
  );
});

function Sidebar(props: any) {
  const { t } = useTranslation("sidebar");
  const location = useRouter();

  const theme = useMantineTheme();
  const { user, privateUserDB } = useUser();
  const [searchValue, setSearchValue] = useLocalStorage<string>({
    defaultValue: "",
    key: "sidebarSearch",
  });
  const DEFAULT_WIDTH = 200;
  const [width, setWidth] = useLocalStorage<number>({
    defaultValue: DEFAULT_WIDTH,
    key: "sidebarWidth",
  });
  let mouseDown = false;
  const { collapsed, toggleCollapsed } = useSidebarStatus();
  if (props.permanentlyExpanded && collapsed) toggleCollapsed();

  function resize(event: MouseEvent) {
    setWidth(clamp(width + (event.pageX - width), 175, 300));
  }

  const linkList: LinkObject[] = [
    {
      link: "/characters",
      name: "characters",
      Icon: IconUsers,
    },
    {
      link: "/cards",
      name: "cards",
      Icon: IconCards,
    },
    {
      link: "/events",
      name: "events",
      Icon: IconAward,
    },
    {
      link: "/scouts",
      name: "scouts",
      Icon: IconDiamond,
    },
    {
      link: "/songs",
      name: "songs",
      Icon: IconMusic,
    },
    {
      link: "/stories",
      name: "stories",
      Icon: IconBooks,
      disabled: true,
    },
    {
      link: "/assets",
      name: "assets",
      Icon: IconPhoto,
    },
    {
      link: "/calendar",
      name: "calendar",
      Icon: IconCalendar,
    },
    {
      link: "/about",
      name: "about",
      Icon: IconInfoCircle,
    },
    {
      link: "https://www.patreon.com/makotools",
      name: "patreon",
      Icon: IconBrandPatreon,
      props: !collapsed && {
        rightSection: (
          <Text color="dimmed" mt={-10 + 4} mb={-10}>
            <IconExternalLink size={16} />
          </Text>
        ),
      },
    },
  ];

  return (
    <Navbar
      position={{ top: 0, left: 0 }}
      width={{
        base: 0,
        xs: collapsed ? 50 : width,
      }}
      hidden={true}
      hiddenBreakpoint="xs"
      sx={{
        position: "sticky",
        top: 0,
        height: "100vh",
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        zIndex: 210,
        boxShadow: theme.shadows.xl,
        boxSizing: "content-box",
      }}
      {...props}
    >
      <Navbar.Section
        sx={(theme) => ({
          padding: theme.spacing.xs / 2,
          maxWidth: "100%",
          minWidth: 0,
        })}
      >
        <SidebarLink
          collapsed={collapsed}
          component={Link}
          href="/"
          label={
            !collapsed && (
              <Box
                sx={{
                  height: 18,
                  display: "flex",
                  ".mkt_dark_text_svg__primaryText": {
                    fill:
                      theme.primaryColor === "mao_pink"
                        ? "#FEE0EE"
                        : theme.primaryColor === "makoto_green"
                        ? "#fbfff7"
                        : theme.primaryColor === "subaru_orange"
                        ? "#FDECDC"
                        : theme.primaryColor === "hokke_blue"
                        ? "#e9f1f7"
                        : theme.primaryColor === "niki_gray"
                        ? "#D7DBDF"
                        : "#E8ECFD",
                  },
                  ".mkt_dark_text_svg__secondaryText": {
                    fill:
                      theme.primaryColor === "mao_pink"
                        ? "#f5abce"
                        : theme.primaryColor === "makoto_green"
                        ? "#d2f0bd"
                        : theme.primaryColor === "subaru_orange"
                        ? "#f5c59a"
                        : theme.primaryColor === "hokke_blue"
                        ? "#83beeb"
                        : theme.primaryColor === "niki_gray"
                        ? "#8BB2D4"
                        : "#A4B1E8",
                  },
                  ".mkt_light_text_svg__primaryText": {
                    fill:
                      theme.primaryColor === "mao_pink"
                        ? "#8c0646"
                        : theme.primaryColor === "makoto_green"
                        ? "#264a0b"
                        : theme.primaryColor === "subaru_orange"
                        ? "#7a2e04"
                        : theme.primaryColor === "hokke_blue"
                        ? "#00172b"
                        : theme.primaryColor === "niki_gray"
                        ? "#165285"
                        : "#1C2F7D",
                  },
                  ".mkt_light_text_svg__secondaryText": {
                    fill:
                      theme.primaryColor === "mao_pink"
                        ? "#b00b59"
                        : theme.primaryColor === "makoto_green"
                        ? "#366612"
                        : theme.primaryColor === "subaru_orange"
                        ? "#b54304"
                        : theme.primaryColor === "hokke_blue"
                        ? "#003d73"
                        : theme.primaryColor === "niki_gray"
                        ? "#337AB7"
                        : "#324CB3",
                  },
                }}
              >
                {theme.colorScheme === "light" ? (
                  <MakotoolsTextLightComponent
                    viewBox="0 0 1753 281"
                    width={100}
                    height={18}
                  />
                ) : (
                  <MakotoolsTextDarkComponent
                    viewBox="0 0 1753 281"
                    width={100}
                    height={18}
                  />
                )}
              </Box>
            )
          }
          Icon={
            <Box
              sx={{
                ".mkt_dark_icon_svg__secondary": {
                  fill:
                    theme.primaryColor === "mao_pink"
                      ? "#f5abce"
                      : theme.primaryColor === "makoto_green"
                      ? "#d2f0bd"
                      : theme.primaryColor === "subaru_orange"
                      ? "#f5c59a"
                      : theme.primaryColor === "hokke_blue"
                      ? "#83beeb"
                      : theme.primaryColor === "niki_gray"
                      ? "#8BB2D4"
                      : "#A4B1E8",
                },
                ".mkt_dark_icon_svg__primary": {
                  fill:
                    theme.primaryColor === "mao_pink"
                      ? "#FEE0EE"
                      : theme.primaryColor === "makoto_green"
                      ? "#fbfff7"
                      : theme.primaryColor === "subaru_orange"
                      ? "#FDECDC"
                      : theme.primaryColor === "hokke_blue"
                      ? "#e9f1f7"
                      : theme.primaryColor === "niki_gray"
                      ? "#D7DBDF"
                      : "#E8ECFD",
                },
                ".mkt_light_icon_svg__secondary": {
                  fill:
                    theme.primaryColor === "mao_pink"
                      ? "#8c0646"
                      : theme.primaryColor === "makoto_green"
                      ? "#264a0b"
                      : theme.primaryColor === "subaru_orange"
                      ? "#b54304"
                      : theme.primaryColor === "hokke_blue"
                      ? "#003d73"
                      : theme.primaryColor === "niki_gray"
                      ? "#337AB7"
                      : "#324CB3",
                },
                ".mkt_light_icon_svg__primary": {
                  fill:
                    theme.primaryColor === "mao_pink"
                      ? "#b00b59"
                      : theme.primaryColor === "makoto_green"
                      ? "#366612"
                      : theme.primaryColor === "subaru_orange"
                      ? "#7a2e04"
                      : theme.primaryColor === "hokke_blue"
                      ? "#00172b"
                      : theme.primaryColor === "niki_gray"
                      ? "#165285"
                      : "#1C2F7D",
                },
              }}
            >
              {theme.colorScheme === "light" ? (
                <MakotoolsLightComponent
                  viewBox="0 0 281 281"
                  width={18}
                  height={18}
                />
              ) : (
                <MakotoolsDarkComponent
                  viewBox="0 0 281 281"
                  width={18}
                  height={18}
                />
              )}
            </Box>
          }
        />
        {collapsed ? (
          <TextInput
            styles={(theme) => ({
              input: {
                padding: theme.spacing.xs,
                paddingRight: 0,
              },
            })}
            // variant="filled"
            value=""
            icon={<IconSearch size={18} />}
            iconWidth={38}
            onClick={() => {
              toggleCollapsed();
              if (props?.onCollapse) props.onCollapse();
            }}
          />
        ) : (
          <TextInput
            styles={(theme) => ({
              input: {
                padding: theme.spacing.xs,
              },
            })}
            // variant="unstyled"
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            placeholder={t("searchbarMessage")}
            icon={<IconSearch size={18} />}
            iconWidth={38}
            rightSection={
              searchValue && (
                <ActionIcon
                  size="xs"
                  onClick={() => {
                    setSearchValue("");
                  }}
                >
                  <IconX size={14} />
                </ActionIcon>
              )
            }
          />
        )}
      </Navbar.Section>
      <Navbar.Section
        grow
        component={ScrollArea}
        styles={{
          viewport: {
            "&>*": {
              minWidth: "0 !important",
              display: "block !important",
              maxWidth: "100%",
              width: "100%",
            },
          },
        }}
        scrollbarSize={4}
      >
        <Stack
          spacing={0}
          sx={(theme) => ({
            padding: theme.spacing.xs / 2,
            paddingTop: 0,
            maxWidth: "100%",
            minWidth: 0,
          })}
        >
          {searchValue ? (
            <SearchResults {...{ searchValue, setSearchValue }} />
          ) : (
            <>
              {linkList
                .filter((l: LinkObject) => l.link)
                .map((link: LinkObject) => {
                  const active =
                    `/${location.asPath.split("/")[1]}` === link.link;
                  return (
                    <Tooltip
                      key={link.link}
                      label={t(`links.${link.name}`)}
                      position="right"
                      disabled={!collapsed}
                      withinPortal
                    >
                      <div>
                        {link.disabled ? (
                          <SidebarLink
                            collapsed={collapsed}
                            active={active}
                            {...link}
                            name={t(`links.${link.name}`)}
                          />
                        ) : (
                          <SidebarLink
                            component={Link}
                            href={link.link}
                            collapsed={collapsed}
                            active={active}
                            {...link}
                            name={t(`links.${link.name}`)}
                          />
                        )}
                      </div>
                    </Tooltip>
                  );
                })}

              <Group
                sx={(theme) => ({
                  padding: theme.spacing.xs / 2,
                  gap: 0,
                })}
                position="center"
                p={0}
              >
                {!collapsed && <></>}
              </Group>
              <UserMenu
                trigger={
                  <SidebarLink
                    collapsed={collapsed}
                    active={true}
                    name={t("links.user")}
                    Icon={
                      <Indicator
                        color="red"
                        position="top-start"
                        disabled={
                          !user?.id ||
                          !privateUserDB?.friends__receivedRequests?.length ||
                          privateUserDB?.friends__receivedRequests?.length <= 0
                        }
                      >
                        <IconUserCircle size={20} />
                      </Indicator>
                    }
                    sx={{ "&&": { flex: "1 1 0" } }}
                    props={{ variant: "subtle" }}
                  />
                }
              />
              {collapsed ? (
                <Group position="right" p={0}>
                  <ActionIcon
                    size={40}
                    radius="sm"
                    onClick={() => {
                      toggleCollapsed();
                      if (props?.onCollapse) props.onCollapse();
                    }}
                    // variant="light"
                  >
                    <Text inline color="dimmed">
                      <IconChevronRight size={20} />
                    </Text>
                  </ActionIcon>
                </Group>
              ) : (
                <Group position="right" p={0}>
                  <ActionIcon
                    size={40}
                    // radius="sm"
                    onClick={() => {
                      toggleCollapsed();
                      if (props?.onCollapse) props.onCollapse();
                    }}
                    variant="default"
                    mr={-5}
                    sx={(theme) => ({
                      borderRadius: 0,
                      borderTopLeftRadius: theme.radius.md,
                      borderBottomLeftRadius: theme.radius.md,
                      borderRightWidth: 0,
                      width: 100,
                      borderColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[5]
                          : theme.colors.gray[2],
                    })}
                  >
                    <Text component={Group} color="dimmed" spacing={4}>
                      <IconChevronLeft size={16} />
                      <Text inline size="sm" weight={500}>
                        {t("collapseSidebar")}
                      </Text>
                    </Text>
                  </ActionIcon>
                </Group>
              )}
            </>
          )}
        </Stack>
      </Navbar.Section>
      {!collapsed && !props.disableResize && (
        <Box
          sx={{
            position: "absolute",
            right: -3,
            width: 6,
            height: "100%",
            zIndex: 5,
            "&:hover": { cursor: "ew-resize" },
          }}
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();
            mouseDown = true;
            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", () => {
              window.removeEventListener("mousemove", resize);
            });
          }}
        />
      )}
    </Navbar>
  );
}

export default Sidebar;
export { SidebarLink };
