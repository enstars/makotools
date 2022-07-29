import Layout from "../../components/Layout";
import PageTitle from "../../components/PageTitle";
import {
  Accordion,
  Anchor,
  AspectRatio,
  Badge,
  Box,
  Grid,
  Indicator,
  Paper,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { MAKOTOOLS } from "../../services/constants";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import ImageViewer from "../../components/core/ImageViewer";
import { getB2File, getLocalizedData } from "../../services/ensquare";
import { parseStringify } from "../../services/utilities";
import Link from "next/link";
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
      <Title order={2} my="md">
        Card Collection
      </Title>
      {!profile?.collection?.length ? (
        <Text color="dimmed">This user has no cards in their collection</Text>
      ) : (
        <>
          <Box
            sx={(theme) => ({
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: theme.spacing.xs,
            })}
          >
            {profile.collection
              .filter((c) => c.count)
              .sort((a, b) => a.count < b.count)
              .map((c) => (
                <Link key={c.id} href={`/cards/${c.id}`} passHref>
                  {/* <Indicator
                    styles={{ indicator: { display: c.count === 1 && "none" } }}
                    size={20}
                    radius="sm"
                    label={
                    }
                  > */}
                  <Paper component="a" withBorder sx={{ position: "relative" }}>
                    <AspectRatio ratio={4 / 5}>
                      <ImageViewer
                        radius="sm"
                        alt={"card image"}
                        withPlaceholder
                        src={getB2File(
                          `assets/card_rectangle4_${c.id}_evolution.png`
                        )}
                      />
                    </AspectRatio>
                    {c.count > 1 && (
                      <Badge
                        sx={{ position: "absolute", bottom: 4, left: 4 }}
                        variant="filled"
                      >
                        <Text inline size="xs" weight="700">
                          {c.count}
                          <Text
                            component="span"
                            sx={{ verticalAlign: "-0.05em", lineHeight: 0 }}
                          >
                            ×
                          </Text>
                        </Text>
                      </Badge>
                    )}
                  </Paper>
                  {/* </Indicator> */}
                </Link>
              ))}
          </Box>
        </>
      )}
    </>
  );
}

export default Page;

export const getServerSideProps = getServerSideUser(
  async ({ locale, params, admin }) => {
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
      const profile = parseStringify(querySnap.docs[0].data(), undefined, 2);
      // const cards = await getLocalizedData("cards", locale, [
      //   "id",
      // ]);
      return {
        props: {
          profile,
          // cards,
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
