import { Badge, Divider, Group, Paper, Text } from "@mantine/core";
import { useRouter } from "next/router";

import { useDayjs } from "services/libraries/dayjs";
import { MakoPost } from "types/makotools";

function Announcement({
  announcement,
  i = 2,
}: {
  announcement: MakoPost;
  i: number;
}) {
  const router = useRouter();
  const { dayjs } = useDayjs();
  return (
    <Paper
      sx={{
        minWidth: 0,
        maxWidth: "100%",
        background: "none",
        cursor: "pointer",
      }}
      onClick={() => router.push(`/about/announcements/${announcement.slug}`)}
    >
      {i > 0 && <Divider mb="sm" />}
      <Text inline weight={700} size="lg">
        {announcement.title}
      </Text>
      <Group spacing="xs" mt="xs">
        {announcement.categories.data.map((c) => (
          <Badge
            variant="dot"
            key={c.id}
            color={
              c.attributes.title === "Releases"
                ? "orange"
                : c.attributes.title === "Beta"
                ? "purple"
                : "toya_default"
            }
            size="sm"
          >
            {c.attributes.title}
          </Badge>
        ))}
        <Text inline weight={400} size="xs" color="dimmed">
          {/* {announcement.date_created} */}
          {/* use dayjs */}
          {dayjs(announcement.date_created).format("MMMM D, YYYY")}
        </Text>
      </Group>
    </Paper>
  );
}

export default Announcement;
