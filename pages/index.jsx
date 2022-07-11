import Link from "next/link";
import {
  Title as MantineTitle,
  Text,
  List,
  Button,
  Paper,
  Card,
  Group,
  Box,
  Divider,
} from "@mantine/core";

import { useUserData } from "../services/userData";
import Banner from "../assets/banner.png";
import Image from "next/image";
function Home() {
  const { userData } = useUserData();
  // console.log(userData.loggedIn);
  return (
    <>
      <Box mt={80} />
      <Image src={Banner} style={{ borderRadius: 12 }} />
      <MantineTitle order={1} mt="sm">
        Welcome to MakoTools!
      </MantineTitle>
      <Text my="sm">
        MakoTools is a website containing information, tools, and a lot more to
        aid you in playing Ensemble Stars!! Music English Version.
      </Text>
      <Text my="sm">
        <b>The site is unfortunately still a work-in-progress</b>, but planned
        features include:
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
      {!userData.loggedIn && (
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
      {/* <Divider my="xl" />
      <Text size="sm">
        MakoTools is a collaboration project between EN:Link, The Ensemble Stars
        Wiki, Daydream Guides, and is developed by the @Enstars Dev Team!
      </Text> */}
    </>
  );
}

export default Home;

import Layout from "../components/Layout";
Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
