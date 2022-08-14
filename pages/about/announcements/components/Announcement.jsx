import {
  Badge,
  Divider,
  Paper,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import Link from "next/link";

import categories from "../../../../data/about/posts/categories.json";

function Announcement({ announcement, i = 2 }) {
  return (
    <Link href={`/about/announcements/${announcement.id}`} passHref>
      <Paper
        component="a"
        sx={{
          minWidth: 0,
          maxWidth: "100%",
          background: "none",
        }}
      >
        {i > 0 && <Divider mb="sm" />}
        <Text inline weight={700} size="lg">
          {announcement.title.rendered}
        </Text>
        <TypographyStylesProvider
          my="xs"
          dangerouslySetInnerHTML={{ __html: announcement.excerpt.rendered }}
          sx={(theme) => ({
            "& > p": {
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.25,
            },
            //dimmed
            // color:
            //   theme.colorScheme === "dark"
            //     ? theme.colors.dark[2]
            //     : theme.colors.gray[6],
            fontSize: theme.fontSizes.sm,
          })}
        />
        {announcement.categories.map((c) => (
          <Badge variant="dot" key={c} color={categories[c].color}>
            {categories[c].name}
          </Badge>
        ))}
      </Paper>
    </Link>
  );
}

export default Announcement;
