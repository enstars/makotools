import {
  Badge,
  Divider,
  Paper,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import Link from "next/link";
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
      {/* <TypographyStylesProvider
          my="xs"
          sx={(theme) => ({
            "& > p": {
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.25,
            },
            fontSize: theme.fontSizes.sm,
          })}
        >
          <div
            dangerouslySetInnerHTML={{ __html: announcement.excerpt.rendered }}
          />
        </TypographyStylesProvider> */}
      {announcement.categories?.map((c) => (
        <Badge variant="dot" key={c} color={categories[c].color}>
          {categories[c].name}
        </Badge>
      ))}
    </Paper>
  );
}

export default Announcement;
