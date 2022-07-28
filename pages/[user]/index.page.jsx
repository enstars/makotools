import Layout from "../../components/Layout";
import PageTitle from "../../components/PageTitle";
import {
  Accordion,
  Anchor,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";
import { MAKOTOOLS } from "../../services/constants";
import getServerSideUser from "../../services/firebase/getServerSideUser";
function Page({ profile }) {
  return (
    <>
      {profile.name ? (
        <>
          <PageTitle title={profile.name}></PageTitle>
          <Text color="dimmed" weight={800} size="lg">
            @{profile.username}
          </Text>
        </>
      ) : (
        <PageTitle title={`@${profile.username}`}></PageTitle>
      )}
    </>
  );
}

export default Page;

export const getServerSideProps = getServerSideUser(
  async ({ params, admin }) => {
    if (!params.user.startsWith("@"))
      return {
        notFound: true,
      };
    const db = admin.firestore();
    const docCollection = db.collection("users");
    const querySnap = await docCollection
      .where("username", "==", params.user.replace("@", ""))
      .get();
    if (!querySnap.empty) {
      const profile = JSON.parse(
        JSON.stringify(querySnap.docs[0].data(), undefined, 2)
      );
      console.log(profile);
      return {
        props: {
          profile,
        },
      };
    }

    return {
      notFound: true,
    };
  }
);

Page.getLayout = function getLayout(page, pageProps) {
  return <Layout pageProps={pageProps}>{page}</Layout>;
};
