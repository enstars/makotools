import { Badge, Divider, Paper, Text } from "@mantine/core";
import { useRouter } from "next/router";

import { MakoPost } from "types/makotools";

function Announcement({
  announcement,
  i = 2,
}: {
  announcement: MakoPost;
  i: number;
}) {
  const router = useRouter();
  // console.log(announcement);
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
      {announcement.categories.data.map((c) => (
        <Badge
          variant="dot"
          key={c.id}
          color={
            c.attributes.title === "Releases"
              ? "orange"
              : c.attributes.title === "Beta"
              ? "purple"
              : "hokke"
          }
        >
          {c.attributes.title}
        </Badge>
      ))}
    </Paper>
  );
}

export default Announcement;
