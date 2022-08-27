import Head from "next/head";
import { Text, Box, TypographyStylesProvider } from "@mantine/core";
import type { WP_REST_API_Post } from "wp-types";

import Layout, { getLayout } from "../../../components/Layout";
import PageTitle from "../../../components/sections/PageTitle";
import ImageViewer from "../../../components/core/ImageViewer";
import Reactions from "../../../components/sections/Reactions";

function Page({ post }: { post: WP_REST_API_Post }) {
  console.log(post);
  return (
    <>
      <PageTitle title={post.title.rendered} />
      <TypographyStylesProvider
        className="wordpress-style"
        sx={(theme) => ({
          figcaption: {
            fontSize: theme.fontSizes.xs,
            color: theme.other.getDimmed(theme),
          },
        })}
      >
        <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
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
    const initRespose = await fetch(
      `https://backend-stars.ensemble.moe/wp-main/wp-json/wp/v2/posts/${params.id}`
    );
    const post = await initRespose.json();

    return {
      props: {
        post,
        meta: { title: post.title.rendered },
      },
    };
  } catch (e) {
    console.error(e);
    return { notFound: true };
  }
}
