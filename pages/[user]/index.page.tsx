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
  Image,
  Indicator,
  Paper,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Link from "next/link";
import {
  IconCalendar,
  IconInfoCircle,
  IconMessageCircle,
  IconUser,
} from "@tabler/icons";
import { useRef, Fragment } from "react";
import Autoplay from "embla-carousel-autoplay";

import Layout, { getLayout } from "../../components/Layout";
import PageTitle from "../../components/sections/PageTitle";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import ImageViewer from "../../components/core/ImageViewer";
import { getB2File, getLocalizedData } from "../../services/ensquare";
import { parseStringify } from "../../services/utilities";
import { useDayjs } from "../../services/dayjs";
import { UserData } from "../../types/makotools";

// import dayjs from "dayjs";
function Page({ profile }: { profile: UserData }) {
  const dayjs = useDayjs();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  console.log(dayjs(profile.profile__start_playing).format("MMMM YYYY"));
  return (
    <>
      {profile?.profile__banner && profile?.profile__banner?.length ? (
        <Box>
          <Box sx={{ marginLeft: "-100%", marginRight: "-100%" }}>
            <Carousel
              slideSize="34%"
              // height={200}
              height="30vh"
              slideGap="xs"
              loop
              withControls={false}
              plugins={[autoplay.current]}
            >
              {/* // doing this so we can surely have enough slides to loop in embla */}
              {[0, 1, 2, 3, 4].map((n) => (
                <Fragment key={n}>
                  {profile?.profile__banner?.map((c) => (
                    <Carousel.Slide key={c}>
                      <Image
                        alt={`Card ${c}`}
                        src={getB2File(
                          `assets/card_still_full1_${c}_evolution.png`
                        )}
                        styles={(theme) => ({
                          root: {
                            height: "100%",
                            overflow: "hidden",
                            borderRadius: theme.radius.sm,
                          },
                          figure: {
                            height: "100%",
                          },
                          imageWrapper: {
                            height: "100%",
                          },
                          image: {
                            height: "100% !important",
                            objectFit: "cover",
                            objectPosition: "top",
                          },
                        })}
                      />
                    </Carousel.Slide>
                  ))}
                </Fragment>
              ))}
            </Carousel>
          </Box>
        </Box>
      ) : null}
      {profile.name ? (
        <>
          <PageTitle
            space={profile?.profile__banner?.length ? 18 : undefined}
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
                  {profile?.profile__pronouns &&
                    `${profile?.profile__pronouns} · `}
                  @{profile.username}
                </Text>
              </>
            }
            mb={0}
          ></PageTitle>
        </>
      ) : (
        <PageTitle
          space={profile?.profile__banner?.length ? 18 : undefined}
          title={
            <>
              @{profile.username}
              {profile?.profile__pronouns && (
                <Text
                  inline
                  component="span"
                  color="dimmed"
                  weight={800}
                  size="lg"
                >
                  {profile?.profile__pronouns}
                </Text>
              )}
            </>
          }
          mb={0}
        ></PageTitle>
      )}

      <Group mt="xs" noWrap align="flex-start">
        <ThemeIcon variant="light" color="lightblue" sx={{ flexShrink: 0 }}>
          <IconInfoCircle size={16} />
        </ThemeIcon>
        <Box>
          <Text size="xs" weight={700} color="dimmed">
            Bio
          </Text>

          {profile?.profile__bio ? (
            <Stack spacing={4}>
              {profile.profile__bio.split("\n").map((l, i) => (
                <Text key={i}>{l}</Text>
              ))}
            </Stack>
          ) : (
            <Text color="dimmed">This user has no bio set</Text>
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
          {profile.profile__start_playing &&
          profile.profile__start_playing !== "0000-00-00"
            ? dayjs(profile.profile__start_playing).format("MMMM YYYY")
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
              .sort((a, b) => b.count - a.count)
              .map((c) => (
                <Link key={c.id} href={`/cards/${c.id}`} passHref>
                  {/* <Indicator
                    styles={{ indicator: { display: c.count === 1 && "none" } }}
                    size={20}
                    radius="sm"
                    label={
                    }
                  > */}
                  <Paper
                    radius="sm"
                    component="a"
                    withBorder
                    sx={{ position: "relative" }}
                  >
                    <AspectRatio ratio={4 / 5}>
                      <Image
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

Page.getLayout = getLayout({ hideOverflow: true });
export default Page;

export const getServerSideProps = getServerSideUser(
  async ({ params, admin }) => {
    if (typeof params?.user !== "string" || !params.user.startsWith("@")) {
      return {
        notFound: true,
      };
    }
    const db = admin.firestore();
    const docCollection = db.collection("users");
    const querySnap = await docCollection
      .where("username", "==", params.user.replace("@", ""))
      .get();
    if (!querySnap.empty) {
      const profile = parseStringify(querySnap.docs[0].data());
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
              : `@${profile.username}`,
            desc:
              profile?.bio ||
              `View @${profile.username}'s profile on MakoTools`,
          },
        },
      };
    }

    return {
      notFound: true,
    };
  }
);
