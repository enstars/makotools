import {
  ActionIcon,
  Alert,
  AspectRatio,
  Badge,
  Box,
  CopyButton,
  Group,
  Image,
  Loader,
  Paper,
  Space,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import Link from "next/link";
import {
  IconAlertCircle,
  IconBrandPatreon,
  IconCalendar,
  IconCopy,
  IconDiscountCheck,
  IconFlag,
  IconHearts,
  IconLink,
  IconPencil,
  IconUserPlus,
  IconUserX,
} from "@tabler/icons";
import { useRef, Fragment, useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useMediaQuery } from "@mantine/hooks";
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  documentId,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import EditProfileModal from "./components/EditProfileModal";
import RemoveFriendModal from "./components/RemoveFriendModal";

import { getLayout, useSidebarStatus } from "components/Layout";
import { UserData, UserLoggedIn } from "types/makotools";
import getServerSideUser from "services/firebase/getServerSideUser";
import { getAssetURL, getLocalizedDataArray } from "services/data";
import { parseStringify } from "services/utilities";
import { useDayjs } from "services/libraries/dayjs";
import useUser from "services/firebase/user";
import BioDisplay from "components/sections/BioDisplay";
import Picture from "components/core/Picture";
import { CONSTANTS } from "services/makotools/constants";
import notify from "services/libraries/notify";
import { GameCard } from "types/game";

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

function Page({
  profile,
  uid,
  cards,
}: {
  profile: UserData;
  uid: string;
  cards: GameCard[] | undefined;
}) {
  const { dayjs } = useDayjs();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
  const user = useUser();
  const shareURL = `enstars.link/@${profile.username}`;
  const shareURLFull = `https://enstars.link/@${profile.username}`;

  const [embla, setEmbla] = useState<Embla | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openRemoveFriendModal, setRemoveFriendModal] =
    useState<boolean>(false);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [profileState, setProfileState] = useState({
    profile__banner: profile.profile__banner,
    name: profile.name,
    profile__pronouns: profile.profile__pronouns,
    profile__start_playing: profile.profile__start_playing,
    profile__bio: profile.profile__bio,
  });
  const [bitchesState, setBitches] = useState<DocumentData[]>([]);

  const { collapsed } = useSidebarStatus();
  const bitches: DocumentData[] = [];
  const rawBitches = (user as UserLoggedIn).privateDb?.friends__list || [];
  const cloutLevel: number = rawBitches.length || 0;

  useEffect(() => {
    const db = getFirestore();
    let i = 0;
    while (i < cloutLevel) {
      getDocs(
        query(
          collection(db, "users"),
          where(
            documentId(),
            "in",
            i + 10 < cloutLevel
              ? rawBitches.slice(i, i + 10)
              : rawBitches.slice(i, cloutLevel)
          )
        )
      ).then((usersQuery) => {
        usersQuery.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          bitches.push(doc.data());
          console.log(bitches);
        });
      });
      i += 10;
    }
    if (bitches.length > 0) setBitches(bitches);
    console.log(bitches);
  }, [user]);

  useEffect(() => {
    if (user.loggedIn) {
      const notUrProfile = profile.suid !== (user as UserLoggedIn).db.suid;
      if (notUrProfile) {
        const friend = bitchesState.find((b) => b.suid === profile.suid);
        if (friend) setIsFriend(true);
        console.log(isFriend);
        setLoading(false);
      }
    }
  }, [bitchesState]);

  useEffect(() => {
    embla?.reInit();
  }, [embla, collapsed]);
  return (
    <>
      <EditProfileModal
        opened={openEditModal}
        openedFunction={setOpenEditModal}
        cards={cards}
        user={user}
        profile={profile}
        profileState={profileState}
        setProfileState={setProfileState}
      />
      <RemoveFriendModal
        opened={openRemoveFriendModal}
        closeFunction={setRemoveFriendModal}
        user={user}
        profile={profile}
      />
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
      <Space h="lg" />

      <Group position="apart">
        <Box>
          <Group align="center" spacing="xs">
            <Title order={1}>{profile?.name || profile.username}</Title>
            {profile.admin?.administrator && (
              <Tooltip label="This user is MakoTools verified.">
                <ActionIcon color="indigo" size="lg">
                  <IconDiscountCheck size={30} />
                </ActionIcon>
              </Tooltip>
            )}
            {isFriend && (
              <Tooltip
                label={`${profile?.name || profile.username} is your friend!`}
              >
                <ActionIcon size="xl" color="pink">
                  <IconHearts />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
          <Text inline component="span" color="dimmed" weight={500} size="lg">
            @{profile.username}
            {profile?.profile__pronouns && ` · ${profile?.profile__pronouns}`}
          </Text>
        </Box>
        {!loading ? (
          <Group spacing="xs">
            {user.loggedIn && user.db.suid === profile.suid && (
              <Tooltip label="Edit profile">
                <ActionIcon
                  onClick={() => {
                    setOpenEditModal(true);
                  }}
                  size="lg"
                  color="green"
                  variant="light"
                >
                  <IconPencil size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            <CopyButton value={shareURLFull}>
              {({ copy }) => (
                <Tooltip label="Copy sharable URL">
                  <ActionIcon
                    onClick={() => {
                      copy();
                      notify("info", {
                        icon: <IconCopy size={16} />,
                        message: "Profile link copied",
                        title: (
                          <>
                            <Text span>
                              <Text span weight={400}>
                                https://
                              </Text>
                              <Text span weight={700}>
                                {shareURL}
                              </Text>
                            </Text>
                          </>
                        ),
                      });
                    }}
                    size="lg"
                    color="hokke"
                    variant="light"
                  >
                    <IconLink size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
            {user.loggedIn && user.db.suid !== profile.suid && (
              <>
                {!isFriend && (
                  <Tooltip label="Send friend request">
                    <ActionIcon
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
                      size="lg"
                      color="green"
                      variant="light"
                    >
                      <IconUserPlus size={18} />
                    </ActionIcon>
                  </Tooltip>
                )}
                {isFriend && (
                  <Tooltip label="Remove friend">
                    <ActionIcon
                      size="lg"
                      color="red"
                      variant="light"
                      onClick={() => setRemoveFriendModal(true)}
                    >
                      <IconUserX size={18} />
                    </ActionIcon>
                  </Tooltip>
                )}
                <Tooltip label="Report profile">
                  <ActionIcon
                    component={Link}
                    href={CONSTANTS.MODERATION.GET_REPORT_LINK(
                      profile.username,
                      profile.suid
                    )}
                    target="_blank"
                    size="lg"
                    color="orange"
                    variant="light"
                  >
                    <IconFlag size={18} />
                  </ActionIcon>
                </Tooltip>
              </>
            )}
          </Group>
        ) : (
          <Loader size="md" variant="dots" />
        )}
      </Group>

      <PatreonBanner profile={profile} />

      {profile?.profile__bio && (
        <BioDisplay
          rawBio={profile.profile__bio}
          withBorder={false}
          // p={0}
          // sx={{ background: "transparent" }}
          my="md"
        />
      )}
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
              dayjs(profile.profile__start_playing).format("MMMM YYYY")}
          </Box>
        </Group>
      )}

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
  async ({ params, admin, locale }) => {
    const cards = await getLocalizedDataArray<GameCard>("cards", locale, "id", [
      "id",
      "title",
      "name",
      "rarity",
    ]);
    if (cards.status === "error") return { props: { cards: undefined } };
    const bannerIds = cards.data.filter((c) => c.rarity >= 4).map((c) => c.id);

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
          cards: cards.data.filter((c) => bannerIds.includes(c.id)),
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
