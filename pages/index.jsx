import Link from "next/link";
import {
  Title as MantineTitle,
  Text,
  List,
  Button,
  Paper,
  Card,
  Group,
} from "@mantine/core";

function Home() {
  return (
    <>
      <MantineTitle order={1} mt={80}>
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
          View any card&apos;s stats, live skills, and support skiils.
        </List.Item>
        <List.Item>
          View an event&apos;s start / end date, with live countdowns and
          optimization tips.
        </List.Item>
        <List.Item>
          Calculate how much dias you have to save up for events.
        </List.Item>
        <List.Item>
          Find fan-translated comics and other various from the series.
        </List.Item>
      </List>
      <Card withBorder shadow="sm" p="lg">
        <Text mb="sm" align="center">
          If you&apos;re interested, help us out by signing up! This helps us
          gauge interest, and signed in users can test out new features in beta
          before they get released!
        </Text>
        <Group position="center">
          <Link href="login" passHref>
            <Button component="a" px="xl">
              Sign up today!
            </Button>
          </Link>
        </Group>
      </Card>
    </>
  );
}

export default Home;

import Layout from "../components/Layout";
Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
