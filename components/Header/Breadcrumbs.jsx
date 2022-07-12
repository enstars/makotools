import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Breadcrumbs,
  Anchor,
  Text,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons";

// function PageAnchor({ref,...props}) {
//   return <Anchor  {...props} />;
// }

function BreadcrumbsApp() {
  const theme = useMantineTheme();
  const location = useRouter();
  const [pathnames, setPathnames] = useState(
    location.asPath.split("/").filter((x) => x)
  );

  useEffect(() => {
    setPathnames(location.asPath.split("/").filter((x) => x));
    // console.log(location);
    // console.log(pathnames);
  }, [location]);

  return (
    <Text
      // size=
      transform="uppercase"
      weight="600"
      // sx={{ fontFamily: theme.headings.fontFamily }}
      sx={(theme) => ({
        zIndex: 10,
        position: "relative",
        letterSpacing: "0.05em",
        fontSize: theme.fontSizes.sm - 2,
      })}
    >
      <Breadcrumbs
        separator={
          <Text inherit color="dimmed">
            /
          </Text>
        }
        styles={(theme) => ({
          separator: {
            marginLeft: theme.spacing.xs / 1.75,
            marginRight: theme.spacing.xs / 1.75,
          },
        })}
      >
        <Link href="/" passHref>
          <Anchor inherit>Makotools</Anchor>
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <Link key={value} href={to} passHref>
              <Anchor inherit>{decodeURIComponent(value)}</Anchor>
            </Link>
          );
        })}
      </Breadcrumbs>
    </Text>
  );
}

export default BreadcrumbsApp;
