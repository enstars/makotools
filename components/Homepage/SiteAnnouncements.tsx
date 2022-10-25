import { Accordion, Anchor, Box, Stack, Text } from "@mantine/core";
import { IconNews } from "@tabler/icons";
import Link from "next/link";
import Announcement from "pages/about/announcements/components/Announcement";

function SiteAnnouncements({ posts }) {
  return (
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
  );
}

export default SiteAnnouncements;
