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

const defaultGetBreadcrumbs = (path: string) =>
  path.split("/").filter((x) => x);

function HeaderContents({
  getBreadcrumbs = defaultGetBreadcrumbs,
  breadcrumbs,
  setOpened,
  ...props
}: {
  getBreadcrumbs?: (path: string) => string[];
  breadcrumbs?: string[];
  setOpened: any;
}) {
  const location = useRouter();
  let pageBreadcrumbs = breadcrumbs || getBreadcrumbs(location.asPath);

  return (
    <Group noWrap align="center" {...props}>
      <MediaQuery largerThan="xs" styles={{ display: "none" }}>
        <Box sx={{ alignSelf: "stretch" }}>
          <ActionIcon onClick={() => setOpened((o: boolean) => !o)}>
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
            <Text inherit color="dimmed" component="span">
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
          <Link href="/" passHref>
            <Anchor inherit>Makotools</Anchor>
          </Link>
          {pageBreadcrumbs.map((crumb: string, index: number) => (
            <Link
              key={crumb}
              href={`/${pageBreadcrumbs.slice(0, index + 1).join("/")}`}
              passHref
            >
              <Anchor inherit>{decodeURIComponent(crumb)}</Anchor>
            </Link>
          ))}
        </Breadcrumbs>
      </Text>
    </Group>
  );
}

export default HeaderContents;
