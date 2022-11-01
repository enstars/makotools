import {
  Blockquote,
  Box,
  NavLink,
  Stack,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBook2,
  IconGavel,
  IconHeart,
  IconHeartHandshake,
  IconLanguageHiragana,
  IconNews,
  IconSpy,
} from "@tabler/icons";
import Link from "next/link";

import { getLayout } from "../../components/Layout";
import PageTitle from "../../components/sections/PageTitle";

import Picture from "components/core/Picture";

function Page() {
  const theme = useMantineTheme();
  const bannerBlue =
    theme.colorScheme === "dark" ? theme.colors.blue[9] : theme.colors.blue[5];
  const backgroundColor =
    theme.colorScheme === "dark"
      ? theme.colors.dark[8]
      : theme.fn.lighten(theme.colors.gray[0], 0.5);
  return (
    <>
      <Box
        sx={(theme) => ({
          maxWidth: "100%",
          overflow: "visible",
          marginBottom: 25,
          "&:after": {
            content: "''",
            display: "block",
            borderRight: `solid 100vw ${backgroundColor}`,
            borderBottom: `solid 48px ${backgroundColor}`,
            borderLeft: `solid 100vw transparent`,
            borderTop: `solid 48px transparent`,
            marginLeft: "-100vw",
            // transform: "translateY(-50%)",
            zIndex: 3,
            position: "absolute",
            top: "calc(50vh - 80px)",
          },
        })}
      >
        <Box
          sx={(theme) => ({
            height: "50vh",
            // minHeight: 200,
            background: bannerBlue,
            marginTop: -16 - 32,
            width: "500%",
            marginLeft: "-200%",
            paddingLeft: "200%",
            paddingRight: "200%",
            paddingTop: 48,
            color: "white",
            paddingBottom: 48,
          })}
        >
          <Picture
            srcB2="assets/card_still_full1_3117_normal.png"
            alt="Makoto streaming"
            sx={{
              position: "absolute",
              width: "calc(100vw - var(--mantine-navbar-width))",
              height: "50vh",
              left: 0,
              top: 0,
              img: {
                objectPosition: "top",
                objectFit: "cover",
              },
              ":before": {
                content: "''",
                position: "absolute",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(#0009, #0000 20%, #0000 60%, #000C)",
                zIndex: 2,
              },
            }}
          />
          <Stack sx={{ height: "100%" }}>
            <Box sx={{ flexGrow: 1 }} />
            <PageTitle
              title={<>About MakoTools</>}
              space={16}
              sx={{
                overflow: "visible",
                zIndex: 5,
              }}
            />
          </Stack>
        </Box>
      </Box>
      <Blockquote icon={<IconBook2 />} pt={0}>
        <Text size="xl">
          MakoTools is a website containing information, tools, and a lot more
          to aid you in playing Ensemble Stars!! Music English.
        </Text>
      </Blockquote>
      {/* <Text>
        MakoTools is a collaboration project in development since November 2021.
      </Text> */}

      <Box
        sx={(theme) => ({
          display: "grid",
          // gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr));",
          // gap: theme.spacing.xs,
        })}
      >
        {[
          { link: "announcements", name: "Site Announcements", icon: IconNews },
          {
            link: "guidelines",
            name: "Community Guidelines",
            icon: IconHeartHandshake,
          },
          {
            link: "translations",
            name: "About Translations",
            icon: IconLanguageHiragana,
          },
          {
            link: "acknowledgements",
            name: "Acknowledgements",
            icon: IconHeart,
          },
          { link: "privacy", name: "Privacy Policy", icon: IconSpy },
          { link: "terms", name: "Terms of Service", icon: IconGavel },
        ].map((l) => (
          <NavLink
            component={Link}
            href={`/about/${l.link}`}
            icon={
              <ThemeIcon variant="light">
                <l.icon size={18} />
              </ThemeIcon>
            }
            key={l.link}
            label={<Text weight={500}>{l.name}</Text>}
            variant="subtle"
            active
            sx={(theme) => ({ borderRadius: theme.radius.sm })}
          />
        ))}
      </Box>
    </>
  );
}

Page.getLayout = getLayout({
  headerProps: {
    forceLight: true,
  },
});
export default Page;
