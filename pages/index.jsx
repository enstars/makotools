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
} from "@mantine/core";

import { useFirebaseUser } from "../services/firebase/user";
import Banner from "../assets/banner.png";
import AffiliatesLight from "../assets/Affiliates/affiliates_light.svg?url";
import AffiliatesDark from "../assets/Affiliates/affiliates_dark.svg?url";
import Image from "next/image";

function Home() {
  const { firebaseUser } = useFirebaseUser();
  const theme = useMantineTheme();

  return (
    <>
      <Box mt={80} />
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
      <Text my="sm">
        MakoTools is a website containing information, tools, and a lot more to
        aid you in playing Ensemble Stars!! Music English Version, created in
        collaboration between{" "}
        <Anchor inherit href="https://twitter.com/enstars_link" target="_blank">
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
          src={theme.colorScheme === "dark" ? AffiliatesDark : AffiliatesLight}
          alt="Affiliates: EN:Link, Daydream, Ensemble Stars Wiki"
        />
      </AspectRatio>
      <Text my="sm">
        <b>MakoTools is still in development</b>, but planned features include:
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
          Find fan-translated comics and other various media from the series.
        </List.Item>
      </List>
      <Text my="sm">
        For the time being, we have a small preview of the site&apos;s look to
        show, so feel free to play around and sign up if you&apos;re interested!
        Hopefully we&apos;ll be able to release parts of the site in future
        updates.
      </Text>
      {!firebaseUser.loggedIn && (
        <Card withBorder shadow="sm" p="lg">
          <Text mb="sm" align="center">
            If you&apos;re interested, help us out by signing up! This helps us
            gauge interest, and signed in users can test out new features in
            beta before they get released!
          </Text>
          <Group position="center">
            <Link href="login" passHref>
              <Button component="a" px="xl" variant="light" color="green">
                Sign up today!
              </Button>
            </Link>
          </Group>
        </Card>
      )}
    </>
  );
}

export default Home;

import Layout from "../components/Layout";
Home.getLayout = function getLayout(page) {
  return <Layout footerTextOnly>{page}</Layout>;
};
