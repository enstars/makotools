import Link from "next/link";
import { useRouter } from "next/router";
import {
  Breadcrumbs,
  Anchor,
  Text,
  Group,
  Box,
  MediaQuery,
  ActionIcon,
} from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";
import useTranslation from "next-translate/useTranslation";

const defaultGetBreadcrumbs = (path: string) =>
  path.split("/").filter((x) => x);

function HeaderContents({
  getBreadcrumbs = defaultGetBreadcrumbs,
  breadcrumbs,
  setOpened,
  headerProps = {},
  ...props
}: {
  getBreadcrumbs?: (path: string) => string[];
  breadcrumbs?: string[];
  setOpened: any;
  headerProps?: any;
}) {
  const { t } = useTranslation("sidebar");
  const location = useRouter();
  let pageBreadcrumbs = breadcrumbs || getBreadcrumbs(location.asPath);
  const { forceLight } = headerProps;

  return (
    <Group position="apart">
      <Group noWrap align="center" {...props} {...headerProps}>
        <MediaQuery largerThan="xs" styles={{ display: "none" }}>
          <Box sx={{ alignSelf: "stretch" }}>
            <ActionIcon
              onClick={() => setOpened((o: boolean) => !o)}
              variant="transparent"
              sx={forceLight && { color: "#fff" }}
            >
              <IconMenu2 size={18} />
            </ActionIcon>
          </Box>
        </MediaQuery>
        <Text
          transform="uppercase"
          weight="600"
          sx={(theme) => ({
            zIndex: 10,
            position: "relative",
            letterSpacing: "0.05em",
            fontSize: theme.fontSizes.sm - 2,
            maxWidth: "100%",
          })}
          inline
        >
          <Breadcrumbs
            separator={
              <Text
                inherit
                color={forceLight ? "#fff8" : "dimmed"}
                component="span"
              >
                /
              </Text>
            }
            styles={(theme) => ({
              separator: {
                display: "inline",
                marginLeft: theme.spacing.xs / 1.75,
                marginRight: theme.spacing.xs / 1.75,
              },
              root: {
                display: "block",
                lineHeight: 1.5,
                paddingTop: theme.spacing.xs * 0.25,
                paddingBottom: theme.spacing.xs * 0.25,
              },
            })}
          >
            <Anchor
              component={Link}
              href="/"
              inherit
              sx={forceLight && { color: "#fff" }}
            >
              {t("breadcrumbTitle")}
            </Anchor>
            {pageBreadcrumbs.map((crumb: string, index: number) => (
              <Anchor
                component={Link}
                key={crumb}
                href={`/${pageBreadcrumbs.slice(0, index + 1).join("/")}`}
                inherit
                sx={forceLight && { color: "#fff" }}
              >
                {decodeURIComponent(crumb)}
              </Anchor>
            ))}
          </Breadcrumbs>
        </Text>
      </Group>
      {/* <Searchbar /> */}
    </Group>
  );
}

export default HeaderContents;
