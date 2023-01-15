import { useEffect, useMemo, useState } from "react";
import { Badge, Box, Card, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { IconCalendarDue } from "@tabler/icons";

import { getLayout } from "components/Layout";
import { getLocalizedDataArray } from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { Event, ID, Scout } from "types/game";
import { QuerySuccess, UserLoggedIn } from "types/makotools";
import PageTitle from "components/sections/PageTitle";
import useUser from "services/firebase/user";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import Picture from "components/core/Picture";
import { useDayjs } from "services/libraries/dayjs";
import { countdown } from "services/campaigns";

function BookmarkedCard({ campaign }: { campaign: Event | Scout }) {
  const { dayjs } = useDayjs();
  const [countdownAmt, setCountdownAmt] = useState<string>();
  useEffect(() => {
    if (dayjs(campaign.end.en).isBefore(dayjs())) {
      setCountdownAmt("PAST");
    } else if (
      dayjs().isBetween(dayjs(campaign.start.en), dayjs(campaign.end.en))
    ) {
      setCountdownAmt("ONGOING");
    } else {
      let ctdwn = countdown(new Date(campaign.start.en), new Date());
      const d = Math.floor(ctdwn / 86400000);
      const h = Math.floor((ctdwn % 86400000) / 3600000);
      const m = Math.floor(((ctdwn % 86400000) % 3600000) / 60000);
      const s = Math.floor((((ctdwn % 86400000) % 3600000) % 60000) / 1000);
      setCountdownAmt(
        d === 0 && h === 0 && m === 0
          ? `${s} secs`
          : d === 0 && h === 0
          ? `${m} mins`
          : d === 0
          ? `${h} hrs`
          : `${d} days`
      );
    }
  }, [campaign.start.en]);

  return (
    <Card
      withBorder
      p={5}
      component={Link}
      href={`/${
        campaign.type === "scout" || campaign.type === "feature scout"
          ? "scouts"
          : "events"
      }/${
        campaign.type === "scout" || campaign.type == "feature scout"
          ? campaign.gacha_id
          : campaign.event_id
      }`}
    >
      <Card.Section>
        <Picture
          alt={campaign.name[0]}
          srcB2={`assets/card_still_full1_${campaign.banner_id}_evolution.webp`}
          sx={{ width: "100%", height: 100 }}
        />
      </Card.Section>
      <Card.Section p={5}>
        <Stack spacing={5}>
          <Group>
            <Badge
              variant="filled"
              color={
                campaign.type === "scout"
                  ? "grape"
                  : campaign.type === "feature scout"
                  ? "blue"
                  : campaign.type === "tour"
                  ? "yellow"
                  : "green"
              }
            >
              {campaign.type}
            </Badge>
            <Badge leftSection={<IconCalendarDue size={14} />}>
              {countdownAmt}
            </Badge>
          </Group>

          <Text weight={700} lineClamp={1}>
            {campaign.name[0]}
          </Text>
          <Text size="sm">
            Starts on {dayjs(campaign.start.en).format("MM/DD/YYYY")}
          </Text>
        </Stack>
      </Card.Section>
    </Card>
  );
}

function Page({
  eventsQuery,
  scoutsQuery,
}: {
  eventsQuery: QuerySuccess<Event[]>;
  scoutsQuery: QuerySuccess<Scout[]>;
}) {
  const user = useUser();

  const events: Event[] = useMemo(() => eventsQuery.data, [eventsQuery.data]);
  const scouts: Scout[] = useMemo(() => scoutsQuery.data, [scoutsQuery.data]);

  const bookmarkedEvents: ID[] =
    (user as UserLoggedIn).db.bookmarks__events || [];
  const bookmarkedScouts: ID[] =
    (user as UserLoggedIn).db.bookmarks__scouts || [];

  const filteredEvents = events.filter((ev) =>
    bookmarkedEvents.includes(ev.event_id)
  );
  const filteredScouts = scouts.filter((sc) =>
    bookmarkedScouts.includes(sc.gacha_id)
  );

  const bookmarkedCampaigns = [...filteredEvents, ...filteredScouts];

  return (
    <>
      <PageTitle title="Bookmarks" />
      <Box>
        <ResponsiveGrid>
          {bookmarkedCampaigns.map((bm: Event | Scout, i: number) => {
            return <BookmarkedCard key={i} campaign={bm} />;
          })}
        </ResponsiveGrid>
      </Box>
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const eventsQuery: any = await getLocalizedDataArray<Event>(
    "events",
    locale,
    "event_id"
  );

  const scoutsQuery: any = await getLocalizedDataArray<Scout>(
    "scouts",
    locale,
    "gacha_id"
  );

  return {
    props: {
      eventsQuery: eventsQuery,
      scoutsQuery: scoutsQuery,
    },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
