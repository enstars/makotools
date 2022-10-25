import Link from "next/link";
import {
  useMantineTheme,
  Title as MantineTitle,
  Text,
  List,
  Group,
  Box,
  AspectRatio,
  Anchor,
  Image as MantineImage,
  Stack,
  Accordion,
  createStyles,
} from "@mantine/core";
import Image from "next/image";
import { IconNews } from "@tabler/icons";

// import Banner from "../assets/banner.png";
import AffiliatesLight from "../assets/Affiliates/affiliates_light.svg?url";
import AffiliatesDark from "../assets/Affiliates/affiliates_dark.svg?url";
import { getLayout } from "../components/Layout";
import getServerSideUser from "../services/firebase/getServerSideUser";
import { getLocalizedDataArray } from "../services/data";
import UpcomingCampaigns from "../components/Homepage/UpcomingCampaigns";

import Announcement from "./about/announcements/components/Announcement";

import {
  BirthdayEvent,
  GameCharacter,
  GameEvent,
  ScoutEvent,
} from "types/game";
import { retrieveEvents } from "services/events";
import CurrentEventCountdown from "components/Homepage/CurrentEventCountdown";
import CurrentScoutsCountdown from "components/Homepage/CurrentScoutsCountdown";
import Banner from "../components/Homepage/Banner";

const useStyles = createStyles((theme, _params) => ({
  mainCol: {
    [`@media (min-width: 768px)`]: {
      maxWidth: "70%",
    },
  },
}));

function Page({
  posts,
  events,
}: {
  posts: any;
  events: (BirthdayEvent | GameEvent | ScoutEvent)[];
}) {
  const theme = useMantineTheme();
  const { classes } = useStyles();

  return (
    <Group align="flex-start" spacing="xl" mt="sm">
      <Stack align="flex-start" spacing="lg" className={classes.mainCol}>
        <Banner events={events} />
        {/* // <Image src={Banner} style={{ borderRadius: 0 }} alt="banner" /> */}
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
        <Box sx={{ flexBasis: 300, flexGrow: 1 }}>
          <CurrentEventCountdown
            events={
              events.filter((event: GameEvent) => event.event_id) as GameEvent[]
            }
          />
          <CurrentScoutsCountdown
            scouts={
              events.filter(
                (scout: ScoutEvent) => scout.gacha_id
              ) as ScoutEvent[]
            }
          />
        </Box>
      </Stack>

      <Stack>
        <UpcomingCampaigns
          events={events as (BirthdayEvent | ScoutEvent | GameEvent)[]}
        />
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
                    {posts.map((p: any, i: number) => (
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
      </Stack>
    </Group>
  );
}

Page.getLayout = getLayout({ wide: true });
export default Page;

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const characters = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id"
  );

  const gameEvents: any = await getLocalizedDataArray<GameEvent>(
    "events",
    locale,
    "event_id"
  );

  const scouts = await getLocalizedDataArray<ScoutEvent>(
    "scouts",
    locale,
    "gacha_id"
  );

  let events: (BirthdayEvent | GameEvent | ScoutEvent)[] = retrieveEvents({
    characters: characters.data,
    gameEvents: gameEvents.data,
    scouts: scouts.data,
  });

  try {
    const initRespose = await fetch(
      `https://backend-stars.ensemble.moe/wp-main/wp-json/wp/v2/posts?categories=5,6&per_page=5&page=1`
    );
    const initData = await initRespose.json();

    return {
      props: {
        posts: initData,
        events: events,
      },
    };
  } catch (e) {
    return {
      props: {
        posts: {
          error: true,
        },
        events: events,
      },
    };
  }
});
