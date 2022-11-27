import { Accordion, Anchor, Box, Stack, Text } from "@mantine/core";
import { IconNews } from "@tabler/icons";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

import Announcement from "pages/about/announcements/components/Announcement";

function SiteAnnouncements({ posts }: { posts: any }) {
  const { t } = useTranslation("home");
  return (
    <Accordion.Item value="announcement">
      <Accordion.Control icon={<IconNews size={18} />}>
        <Text inline weight={500}>
          {t("announcements.title")}
        </Text>
      </Accordion.Control>
      <Accordion.Panel>
        {posts?.error ? (
          <Text size="sm" align="center" color="dimmed">
            {t("announcements.fetchError")}
          </Text>
        ) : (
          <>
            <Stack spacing="sm">
              {posts.map((p: any, i: number) => (
                <Announcement key={p.id} announcement={p} i={i} />
              ))}
            </Stack>
            <Box mt="xs">
              <Anchor component={Link} href="/about/announcements" size="xs">
                {t("announcements.seeAll")}
              </Anchor>
            </Box>
          </>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default SiteAnnouncements;
