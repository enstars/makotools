import { Badge, Divider, Paper, Text } from "@mantine/core";
import { useRouter } from "next/router";

import categories from "../../../../data/about/posts/categories.json";
import { MkAnnouncement } from "../../../../types/makotools";

function Announcement({
  announcement,
  i = 2,
}: {
  announcement: MkAnnouncement;
  i: number;
}) {
  const router = useRouter();
  return (
    <Paper
      sx={{
        minWidth: 0,
        maxWidth: "100%",
        background: "none",
        cursor: "pointer",
      }}
      onClick={() => router.push(`/about/announcements/${announcement.id}`)}
    >
      {i > 0 && <Divider mb="sm" />}
      <Text inline weight={700} size="lg">
        {announcement.title.rendered}
      </Text>
      {announcement.categories?.map((c) => (
        <Badge variant="dot" key={c} color={categories[c].color}>
          {categories[c].name}
        </Badge>
      ))}
    </Paper>
  );
}

export default Announcement;
