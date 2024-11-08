import { Badge, Group, Text, TypographyStylesProvider } from "@mantine/core";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import Reactions from "components/sections/Reactions";
import { MakoPost, StrapiItem } from "types/makotools";
import { fetchOceans } from "services/makotools/posts";
import { useDayjs } from "services/libraries/dayjs";

function Page({ post }: { post: StrapiItem<MakoPost> }) {
  const { dayjs } = useDayjs();
  return (
    <>
      <PageTitle title={post.attributes.title} />

      <Group spacing="xs" mt="xs" mb="lg">
        {post.attributes.categories.data.map((c) => (
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
        <Text inline weight={400} size="sm" color="dimmed">
          {/* {announcement.date_created} */}
          {/* use dayjs */}
          {dayjs(post.attributes.date_created).format("MMMM D, YYYY")}
        </Text>
      </Group>
      <TypographyStylesProvider
        sx={(theme) => ({
          figcaption: {
            fontSize: theme.fontSizes.xs,
            color: theme.other.dimmed,
          },
        })}
      >
        <div dangerouslySetInnerHTML={{ __html: post.attributes.content }} />
      </TypographyStylesProvider>
      <Reactions />
    </>
  );
}

Page.getLayout = getLayout({});
export default Page;

export async function getStaticPaths() {
  const { data: posts } = await fetchOceans<StrapiItem<MakoPost>[]>("/posts");
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { id: number } }) {
  try {
    const { data: posts } = await fetchOceans<StrapiItem<MakoPost>[]>(
      "/posts",
      {
        populate: "*",
        filters: { slug: { $eq: params.id } },
      }
    );

    const post = posts[0];
    return {
      props: {
        post: post,
        meta: { title: post.attributes.title, desc: post.attributes.preview },
        breadcrumbs: [
          "about",
          "announcements",
          `${params.id}[ID]${post.attributes.title}`,
        ],
      },
    };
  } catch (e) {
    console.error(e);
    return { notFound: true };
  }
}
