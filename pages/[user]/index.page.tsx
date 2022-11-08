import {
  Alert,
  Anchor,
  AspectRatio,
  Badge,
  Box,
  Divider,
  Group,
  Image,
  Paper,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import Link from "next/link";
import {
  IconAlertCircle,
  IconBrandPatreon,
  IconCalendar,
  IconInfoCircle,
} from "@tabler/icons";
import { useRef, Fragment, useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useMediaQuery } from "@mantine/hooks";

import { getLayout, useSidebarStatus } from "../../components/Layout";
import PageTitle from "../../components/sections/PageTitle";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { getAssetURL } from "../../services/data";
import { parseStringify } from "../../services/utilities";
import { useDayjs } from "../../services/libraries/dayjs";
import { UserData } from "../../types/makotools";

import useUser from "services/firebase/user";
import BioDisplay from "components/sections/BioDisplay";
import Picture from "components/core/Picture";
import { CONSTANTS } from "services/makotools/constants";

function Page({ profile }: { profile: UserData }) {
  const { dayjs } = useDayjs();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
  const user = useUser();

  const [embla, setEmbla] = useState<Embla | null>(null);

  const { collapsed } = useSidebarStatus();
  useEffect(() => {
    embla?.reInit();
  }, [embla, collapsed]);
  console.log(profile?.admin.patreon);
  return (
    <>
      {profile?.profile__banner && profile.profile__banner?.length ? (
        <Box mt="sm" sx={{ marginLeft: "-100%", marginRight: "-100%" }}>
          <Carousel
            slideSize="34%"
            height={isMobile ? 150 : 250}
            slideGap="xs"
            loop
            withControls={false}
            plugins={[autoplay.current]}
            getEmblaApi={setEmbla}
            draggable={profile.profile__banner.length > 1}
          >
            {/* // doing this so we can surely have enough slides to loop in embla */}
            {(profile.profile__banner.length > 1 ? [0, 1, 2, 3] : [0]).map(
              (n) => (
                <Fragment key={n}>
                  {profile?.profile__banner?.map((c) => (
                    <Carousel.Slide key={c}>
                      <Picture
                        alt={`Card ${c}`}
                        srcB2={`assets/card_still_full1_${c}_evolution.png`}
                        sx={{
                          height: "100%",
                        }}
                        radius="sm"
                      />
                    </Carousel.Slide>
                  ))}
                </Fragment>
              )
            )}
          </Carousel>
        </Box>
      ) : null}
      {user.loggedIn &&
        user.db.suid === profile.suid &&
        user.db.admin.disableTextFields && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            sx={{ marginTop: "2vh" }}
          >
            You&apos;ve been restricted from editing your profile. You can
            submit an appeal through our{" "}
            <Text component={Link} href="/issues">
              issues
            </Text>{" "}
            page.
          </Alert>
        )}
      {profile.name ? (
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
              {profile?.admin.patreon > 0 && (
                <Group sx={{ margin: "1vh 0vw" }} spacing="xs">
                  <IconBrandPatreon size={20} strokeWidth={3} color="#fab005" />{" "}
                  <Badge variant="filled" color="indigo">
                    Patreon Tier {profile.admin.patreon}
                  </Badge>
                </Group>
              )}
            </>
          }
          mb={0}
        />
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
              {profile?.admin.patreon > 0 && (
                <Group sx={{ margin: "1vh 0vw" }} spacing="xs">
                  <IconBrandPatreon size={20} strokeWidth={3} color="#fab005" />{" "}
                  <Badge variant="filled" color="indigo">
                    Patreon Tier {profile.admin.patreon}
                  </Badge>
                </Group>
              )}
            </>
          }
          mb={0}
        />
      )}
      <Group mt="xs" noWrap align="flex-start">
        <ThemeIcon variant="light" color="lightblue" sx={{ flexShrink: 0 }}>
          <IconInfoCircle size={16} />
        </ThemeIcon>
        <Box sx={{ width: "100%" }}>
          <Text size="xs" weight={700} color="dimmed">
            Bio
          </Text>

          {profile?.profile__bio ? (
            <BioDisplay rawBio={profile.profile__bio} />
          ) : (
            <Text color="dimmed">This user has no bio set</Text>
          )}
        </Box>
      </Group>
      {profile.profile__start_playing !== "0000-00-00" && (
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
      )}

      <Group position="right" mt="xs">
        {user.loggedIn && user.db.suid !== profile.suid && (
          <Anchor
            component={Link}
            href={CONSTANTS.MODERATION.GET_REPORT_LINK(
              profile.username,
              profile.suid
            )}
            target="_blank"
            color="dimmed"
            size="sm"
          >
            Report User
          </Anchor>
        )}
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
                <Paper
                  radius="sm"
                  component={Link}
                  key={c.id}
                  href={`/cards/${c.id}`}
                  withBorder
                  sx={{ position: "relative" }}
                >
                  <AspectRatio ratio={4 / 5}>
                    <Image
                      radius="sm"
                      alt={"card image"}
                      withPlaceholder
                      src={getAssetURL(
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
      return {
        props: {
          profile,
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
