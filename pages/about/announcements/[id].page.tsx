import { TypographyStylesProvider } from "@mantine/core";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import Reactions from "components/sections/Reactions";
import { MakoPost, StrapiItem } from "types/makotools";
import { fetchOceans } from "services/makotools/posts";

function Page({ post }: { post: StrapiItem<MakoPost> }) {
  return (
    <>
      <PageTitle title={post.attributes.title} />
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

export async function getServerSideProps({
  params,
}: {
  params: { id: string };
}) {
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
