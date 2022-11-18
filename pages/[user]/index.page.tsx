import {
  ActionIcon,
  Alert,
  AspectRatio,
  Badge,
  Box,
  CopyButton,
  Divider,
  Group,
  Image,
  Menu,
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
  IconCopy,
  IconDots,
  IconFlag,
  IconInfoCircle,
  IconMessageShare,
  IconUserPlus,
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
import notify from "services/libraries/notify";

function PatreonBanner({ profile }: { profile: UserData }) {
  if (profile?.admin?.patreon) {
    const tier = CONSTANTS.PATREON.TIERS[profile?.admin?.patreon];
    if (profile?.admin?.patreon > 0)
      return (
        <Alert
          color="orange"
          icon={<IconBrandPatreon size={20} />}
          my="xs"
          // title={`${tier.NAME} Tier ($${tier.VALUE}) Patreon Supporter!`}
        >
          <Text color="orange" weight={700}>
            {tier.NAME} (${tier.VALUE}) Patreon Supporter!
          </Text>
        </Alert>
      );
  }
  return null;
}

function Page({ profile, uid }: { profile: UserData; uid: string }) {
  const { dayjs } = useDayjs();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
  const user = useUser();
  const shareURL = `enstars.link/@${profile.username}`;
  const shareURLFull = `https://enstars.link/@${profile.username}`;

  const [embla, setEmbla] = useState<Embla | null>(null);

  const { collapsed } = useSidebarStatus();
  useEffect(() => {
    embla?.reInit();
  }, [embla, collapsed]);
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
        user.db?.admin?.disableTextFields && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            sx={{ marginTop: "2vh" }}
          >
            You&apos;ve been restricted from editing your profile. You can
            submit an appeal through our{" "}
            <Text
              component={Link}
              href="/issues"
              sx={{ textDecoration: "underline" }}
            >
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
            </>
          }
          mb={0}
        />
      )}
      <PatreonBanner profile={profile} />
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

      <Paper withBorder mt="xs">
        <Group p={4} pl="xs">
          <Group spacing={0} sx={{ "&&": { flexGrow: 1 } }}>
            <IconMessageShare size={18} />
            <Text size="sm" ml="xs">
              <Text span color="dimmed" weight={500}>
                https://
              </Text>
              <Text span weight={700}>
                {shareURL}
              </Text>
            </Text>
            <CopyButton value={shareURLFull}>
              {({ copy }) => (
                <ActionIcon
                  onClick={() => {
                    copy();
                    notify("info", { message: "Profile link copied" });
                  }}
                  size="sm"
                >
                  <IconCopy size={16} />
                </ActionIcon>
              )}
            </CopyButton>
          </Group>
          {user.loggedIn && user.db.suid !== profile.suid && (
            <Menu shadow="sm" width={200} position="top-end">
              <Menu.Target>
                <ActionIcon>
                  <IconDots size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  href={CONSTANTS.MODERATION.GET_REPORT_LINK(
                    profile.username,
                    profile.suid
                  )}
                  target="_blank"
                  icon={<IconFlag size={14} />}
                >
                  Report User
                </Menu.Item>
                {user.loggedIn && (
                  <Menu.Item
                    icon={<IconUserPlus size={14} />}
                    onClick={async () => {
                      const token = await user.user.getIdToken();
                      await fetch("/api/friendRequest", {
                        method: "POST",
                        headers: {
                          Authorization: token || "",
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ friend: uid }),
                      });
                    }}
                  >
                    Send Friend Request
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Paper>
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
          uid: querySnap.docs[0].id,
          meta: {
            title: profile?.name
              ? `${profile.name} (@${profile.username})`
              : `@${profile.username}`,
            desc:
              profile?.profile__bio ||
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
