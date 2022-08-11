import Link from "next/link";
import {
  useMantineTheme,
  Title as MantineTitle,
  Text,
  List,
  Button,
  Paper,
  Card,
  Group,
  Box,
  Divider,
  createStyles,
  AspectRatio,
  Anchor,
  Image as MantineImage,
  Stack,
  ScrollArea,
  Title,
  Accordion,
} from "@mantine/core";

import Image from "next/image";

import { IconNews } from "@tabler/icons";

import Breadcrumbs from "../components/Layout/Header/Breadcrumbs";

import { useFirebaseUser } from "../services/firebase/user";
import Banner from "../assets/banner.png";
import AffiliatesLight from "../assets/Affiliates/affiliates_light.svg?url";
import AffiliatesDark from "../assets/Affiliates/affiliates_dark.svg?url";

import Layout from "../components/Layout";
import SiteAnnouncements from "../components/core/SiteAnnouncements";
import Announcement from "../components/core/Announcement";

function Page({ posts }) {
  const { firebaseUser } = useFirebaseUser();
  const theme = useMantineTheme();

  return (
    <>
      <Image src={Banner} style={{ borderRadius: 0 }} />
      <MantineTitle order={1} mt="sm">
        Welcome to{" "}
        <Text
          inline
          inherit
          component="span"
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark"
                ? theme.colors.blue[2]
                : theme.colors.blue[5],
          })}
        >
          MakoTools
        </Text>
        !
      </MantineTitle>
      <Group spacing="sm" align="flex-start">
        <Box sx={{ flexBasis: 300, flexGrow: 1 }}>
          <Text my="sm">
            MakoTools is a website containing information, tools, and a lot more
            to aid you in playing Ensemble Stars!! Music English Version,
            created in collaboration between{" "}
            <Anchor
              inherit
              href="https://twitter.com/enstars_link"
              target="_blank"
            >
              EN:Link
            </Anchor>
            , The{" "}
            <Anchor
              inherit
              href="https://ensemble-stars.fandom.com"
              target="_blank"
            >
              English
            </Anchor>
            {" / "}
            <Anchor
              inherit
              href="https://ensemblestars.huijiwiki.com"
              target="_blank"
            >
              Chinese
            </Anchor>{" "}
            Ensemble Stars Wiki,{" "}
            <Anchor
              inherit
              href="https://twitter.com/DaydreamGuides"
              target="_blank"
            >
              Daydream Guides
            </Anchor>
            .
          </Text>
          <AspectRatio
            ratio={3 / 1}
            mx="auto"
            sx={(theme) => ({
              svg: {
                width: "100%",
              },
              maxWidth: 400,
            })}
          >
            <MantineImage
              src={
                theme.colorScheme === "dark" ? AffiliatesDark : AffiliatesLight
              }
              alt="Affiliates: EN:Link, Daydream, Ensemble Stars Wiki"
              px="sm"
            />
          </AspectRatio>

          <Text my="sm">
            <b>MakoTools is still in development</b>, but planned features
            include:
          </Text>
          <List my="sm" withPadding>
            <List.Item>
              View any card&apos;s stats, skills, and related items.
            </List.Item>
            <List.Item>
              View an event&apos;s start / end date, with live countdowns and
              optimization tips.
            </List.Item>
            <List.Item>
              Calculate how much dias you have to save up for events.
            </List.Item>
            <List.Item>
              Find fan-translated comics and other various media from the
              series.
            </List.Item>
          </List>
        </Box>

        <Accordion
          mt="xs"
          variant="contained"
          defaultValue="announcement"
          sx={{ flexBasis: 300, flexGrow: 0.01, minWidth: 0 }}
        >
          <Accordion.Item value="announcement">
            <Accordion.Control icon={<IconNews size={18} />}>
              <Text inline weight={500}>
                Site Announcements
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              {posts?.error ? (
                <Text size="sm" align="center" color="dimmed">
                  Error fetching latest announcements
                </Text>
              ) : (
                <>
                  <Stack spacing="sm">
                    {posts.map((p, i) => (
                      <Announcement key={p.id} announcement={p} i={i} />
                    ))}
                  </Stack>
                  <Box mt="xs">
                    <Link href="/about/announcements" passHref>
                      <Anchor component="a" size="xs">
                        See all announcements
                      </Anchor>
                    </Link>
                  </Box>
                </>
              )}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Group>
    </>
  );
}

export default Page;
Page.getLayout = function getLayout(page, pageProps) {
  return (
    <Layout footerTextOnly pageProps={pageProps}>
      {page}
    </Layout>
  );
};

export const getServerSideProps = async ({ req, res, locale, params }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=7200, stale-while-revalidate=172800"
  );
  // refresh every 2 hours, stale for 48hrs

  try {
    const initRespose = await fetch(
      `https://backend-stars.ensemble.moe/wp-main/wp-json/wp/v2/posts?categories=5,6&per_page=5&page=1`
    );
    const initData = await initRespose.json();

    return {
      props: {
        posts: initData,
      },
    };
  } catch (e) {
    return {
      props: {
        posts: {
          error: true,
        },
      },
    };
  }
};
