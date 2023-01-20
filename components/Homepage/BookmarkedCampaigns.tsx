import { Carousel } from "@mantine/carousel";
import {
  Button,
  Container,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowRight, IconArrowLeft, IconCalendarDue } from "@tabler/icons";
import Link from "next/link";
import { useEffect, useState } from "react";

import ResponsiveGrid from "components/core/ResponsiveGrid";
import useUser from "services/firebase/user";
import { Campaign, Event, Scout } from "types/game";
import { countdown } from "services/campaigns";
import { getAssetURL } from "services/data";
import { useDayjs } from "services/libraries/dayjs";

function BookmarkedCard({ campaign }: { campaign: Campaign }) {
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
    <Paper
      withBorder
      shadow="xs"
      p={5}
      component={Link}
      href={
        campaign.type === "feature scout" || campaign.type === "scout"
          ? `/scouts/${(campaign as Scout).gacha_id}`
          : `/events/${(campaign as Event).event_id}`
      }
    >
      <Group noWrap align="flex-start" spacing="xs">
        <Image
          alt={campaign.name[0]}
          src={getAssetURL(
            `assets/card_still_full1_${campaign.banner_id}_evolution.webp`
          )}
          width={80}
          height={80}
          radius="md"
        />
        <Stack spacing="xs">
          <Text weight={700} lineClamp={2}>
            {campaign.name[0]}
          </Text>
          <Group spacing={3} align="center">
            <IconCalendarDue size={16} />
            <Tooltip
              label={dayjs(campaign.start.en).format("MMMM DD YYYY")}
              position="bottom"
            >
              <Text size="sm" weight={500}>
                Starts in {countdownAmt}
              </Text>
            </Tooltip>
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
}

function BookmarkedSlide({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <ResponsiveGrid width={230} my={5}>
      {campaigns.map((cmpgn, i) => {
        return <BookmarkedCard key={i} campaign={cmpgn} />;
      })}
    </ResponsiveGrid>
  );
}

function BookmarkedCampaigns({ campaigns }: { campaigns: Campaign[] }) {
  const user = useUser();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);

  const GRID_TOTAL = 3;
  const slidesArray: Campaign[][] = [];

  for (let i = 0; i < campaigns.length; i += GRID_TOTAL) {
    let slide = campaigns.slice(i, i + GRID_TOTAL);
    slidesArray.push(slide);
  }

  return (
    <Container mt="3vh" mb="7vh">
      <Title order={2}>Bookmarked Campaigns</Title>
      {!campaigns || campaigns.length === 0 ? (
        <Paper p={15} my={10}>
          You have no campaigns bookmarked.
        </Paper>
      ) : (
        <Carousel
          loop
          orientation={isMobile ? "vertical" : "horizontal"}
          height={isMobile ? 400 : 120}
          withControls={!isMobile}
          controlSize={40}
          controlsOffset="xs"
          nextControlIcon={
            <Button
              variant="default"
              rightIcon={<IconArrowRight />}
              styles={(theme) => ({
                icon: {
                  color: theme.colors[theme.primaryColor][4],
                },
                label: {
                  color: theme.colors[theme.primaryColor][4],
                },
              })}
            >
              Next
            </Button>
          }
          previousControlIcon={
            <Button
              variant="default"
              leftIcon={<IconArrowLeft />}
              styles={(theme) => ({
                icon: {
                  color: theme.colors[theme.primaryColor][4],
                },
                label: {
                  color: theme.colors[theme.primaryColor][4],
                },
              })}
            >
              Previous
            </Button>
          }
          align="start"
          styles={(theme) => ({
            controls: {
              top: "100%",
            },
            control: {
              border: "none",
              background: "none",
            },
          })}
        >
          {slidesArray.map((slide, i) => {
            return (
              <Carousel.Slide key={i}>
                <BookmarkedSlide campaigns={slide} />
              </Carousel.Slide>
            );
          })}
        </Carousel>
      )}
    </Container>
  );
}

export default BookmarkedCampaigns;
