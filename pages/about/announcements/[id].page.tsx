import { TypographyStylesProvider } from "@mantine/core";

import { getLayout } from "../../../components/Layout";
import PageTitle from "../../../components/sections/PageTitle";
import Reactions from "../../../components/sections/Reactions";
import { MkAnnouncement } from "../../../types/makotools";

function Page({ post }: { post: MkAnnouncement }) {
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
