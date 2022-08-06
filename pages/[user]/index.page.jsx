import Layout from "../../components/Layout";
import PageTitle from "../../components/PageTitle";
import {
  Accordion,
  Anchor,
  AspectRatio,
  Badge,
  Blockquote,
  Box,
  Divider,
  Grid,
  Group,
  Indicator,
  Paper,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { MAKOTOOLS } from "../../services/constants";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import ImageViewer from "../../components/core/ImageViewer";
import { getB2File, getLocalizedData } from "../../services/ensquare";
import { parseStringify } from "../../services/utilities";
import Link from "next/link";
import { IconCalendar, IconInfoCircle } from "@tabler/icons";
import { useDayjs } from "../../services/dayjs";
// import dayjs from "dayjs";
function Page({ profile }) {
  const dayjs = useDayjs();
  console.log(dayjs(profile.profile_start_playing).format("MMMM YYYY"));
  return (
    <>
      {profile.name ? (
        <>
          <PageTitle
            title={
              <>
                {profile.name}{" "}
                <Text
                  inline
                  component="span"
                  color="dimmed"
                  weight={800}
                  size="lg"
                >
                  @{profile.username}
                </Text>
              </>
            }
            mb={0}
          ></PageTitle>
        </>
      ) : (
        <PageTitle title={`@${profile.username}`} mb={0}></PageTitle>
      )}

      <Group mt="xs" noWrap align="flex-start">
        <ThemeIcon variant="light" color="lightblue" sx={{ flexShrink: 0 }}>
          <IconInfoCircle size={16} />
        </ThemeIcon>
        <Box>
          <Text size="xs" weight={700} color="dimmed">
            Bio
          </Text>

          {profile?.profile_bio ? (
            <Stack spacing={4}>
              {profile.profile_bio.split("\n").map((l, i) => (
                <Text key={i}>{l}</Text>
              ))}
            </Stack>
          ) : (
            <Text>This user has no bio set</Text>
          )}
        </Box>
      </Group>
      <Group mt="xs" noWrap align="flex-start">
        <ThemeIcon variant="light" color="yellow" sx={{ flexShrink: 0 }}>
          <IconCalendar size={16} />
        </ThemeIcon>
        <Box>
          <Text size="xs" weight={700} color="dimmed">
            Started Playing
          </Text>
          {profile.profile_start_playing
            ? dayjs(profile.profile_start_playing).format("MMMM YYYY")
            : "Unknown"}
        </Box>
      </Group>

      <Divider my="xs" />

      <Title order={2} mt="md" mb="xs">
        Card Collection
      </Title>
      {!profile?.collection?.length ? (
        <Text color="dimmed" size="sm">
          This user has no cards in their collection
        </Text>
      ) : (
        <>
          <Box
            sx={(theme) => ({
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
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
                        radius="xs"
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
          meta: {
            title: profile?.name
              ? `${profile.name} (@${profile.username})`
              : `(@${profile.username}`,
            desc: profile?.bio,
          },
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
