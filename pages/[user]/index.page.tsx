import {
  ActionIcon,
  Alert,
  AspectRatio,
  Badge,
  Box,
  CopyButton,
  Group,
  Image,
  Indicator,
  Loader,
  Menu,
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
  IconArrowsUpDown,
  IconBrandPatreon,
  IconCalendar,
  IconCheck,
  IconCopy,
  IconDiscountCheck,
  IconFlag,
  IconHearts,
  IconLink,
  IconPencil,
  IconUserExclamation,
  IconUserPlus,
  IconUserX,
  IconX,
} from "@tabler/icons";
import { useRef, Fragment, useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useMediaQuery } from "@mantine/hooks";
import {
  arrayRemove,
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  documentId,
  getDocs,
  getFirestore,
  query,
  where,
  arrayUnion,
} from "firebase/firestore";
import { showNotification, updateNotification } from "@mantine/notifications";

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
  const [pendingFriendReq, setPendingFriendReq] = useState<boolean>(false);
  const [isYourFan, setFanBehavior] = useState<boolean>(false);
  const { collapsed } = useSidebarStatus();
  const bitches: DocumentData[] = [];
  const soonToBeBitches: DocumentData[] = [];
  const fans: DocumentData[] = [];
  const rawBitches = (user as UserLoggedIn).privateDb?.friends__list || [];
  const thirstList =
    (user as UserLoggedIn).privateDb?.friends__sentRequests || [];
  const rawFans =
    (user as UserLoggedIn).privateDb?.friends__receivedRequests || [];
  const totalRawBitches = [...rawBitches, ...thirstList, ...rawFans];
  const totalBitches: DocumentData[] = [];
  const cloutLevel: number = totalRawBitches.length || 0;

  useEffect(() => {
    const loadFriends = async (user: UserLoggedIn) => {
      const db = getFirestore();
      let i = 0;
      while (i < cloutLevel) {
        const usersQuery = await getDocs(
          query(
            collection(db, "users"),
            where(
              documentId(),
              "in",
              i + 10 < cloutLevel
                ? totalRawBitches.slice(i, i + 10)
                : totalRawBitches.slice(i, cloutLevel)
            )
          )
        );
        usersQuery.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          if (rawBitches.includes(doc.id)) {
            bitches.push(doc.data());
          } else if (thirstList.includes(doc.id)) {
            soonToBeBitches.push(doc.data());
          } else if (rawFans.includes(doc.id)) {
            fans.push(doc.data());
          }
          totalBitches.push(doc.data());
        });
        i += 10;
      }
      const notUrProfile = profile.suid !== user.db.suid;
      if (!notUrProfile) {
        setLoading(false);
      } else {
        const friend = bitches.find((b) => b.suid === profile.suid);
        const youSentReq = soonToBeBitches.find((b) => b.suid === profile.suid);
        const findFan = fans.find((b) => b.suid === profile.suid);
        if (friend) setIsFriend(true);
        if (youSentReq) setPendingFriendReq(true);
        if (findFan) setFanBehavior(true);
        setLoading(false);
      }
    };
    if (user.loggedIn) {
      loadFriends(user);
    }
  }, [user, totalBitches]);

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
        user={user as UserLoggedIn}
        uid={uid}
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
                <ActionIcon color={theme.primaryColor} size="lg">
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
                    color={theme.primaryColor}
                    variant="light"
                  >
                    <IconLink size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
            {user.loggedIn && user.db.suid !== profile.suid && (
              <>
                {!isFriend && !pendingFriendReq && !isYourFan && (
                  <Tooltip label="Send friend request">
                    <ActionIcon
                      onClick={async () => {
                        showNotification({
                          id: "friendReq",
                          loading: true,
                          message: "Processing your request...",
                          disallowClose: true,
                          autoClose: false,
                        });
                        const token = await user.user.getIdToken();
                        const res = await fetch("/api/friendRequest/add", {
                          method: "POST",
                          headers: {
                            Authorization: token || "",
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ friend: uid }),
                        });

                        const status = await res.json();
                        if (status?.success) {
                          updateNotification({
                            id: "friendReq",
                            loading: false,
                            color: "lime",
                            icon: <IconCheck size={24} />,
                            message:
                              "Your friend request was sent successfully!",
                          });
                        } else {
                          updateNotification({
                            id: "friendReq",
                            loading: false,
                            color: "red",
                            icon: <IconX size={24} />,
                            title: "An error occured:",
                            message:
                              "Your friend request could not be processed.",
                          });
                        }
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
                {!isFriend && isYourFan && (
                  <Menu width={200} position="top">
                    <Menu.Target>
                      <Tooltip
                        label={`${profile.name} sent you a friend request`}
                      >
                        <Indicator>
                          <ActionIcon size="lg" variant="light">
                            <IconUserExclamation size={18} />
                          </ActionIcon>
                        </Indicator>
                      </Tooltip>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Friend request options</Menu.Label>
                      <Menu.Item
                        icon={<IconCheck size={14} />}
                        px={5}
                        onClick={async () => {
                          showNotification({
                            id: "addFriend",
                            loading: true,
                            message: "Processing your request...",
                            disallowClose: true,
                            autoClose: false,
                          });
                          const token = await user.user.getIdToken();
                          const res = await fetch("/api/friend/add", {
                            method: "POST",
                            headers: {
                              Authorization: token || "",
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ friend: uid }),
                          });
                          const status = await res.json();
                          if (status?.success) {
                            user.privateDb.set({
                              friends__receivedRequests: arrayRemove(uid),
                              friends__list: arrayUnion(uid),
                            });
                            updateNotification({
                              id: "addFriend",
                              loading: false,
                              color: "lime",
                              icon: <IconCheck size={24} />,
                              message: `${
                                profile.name || profile.username
                              } is now your friend!`,
                            });
                          } else {
                            updateNotification({
                              id: "addFriend",
                              loading: false,
                              color: "red",
                              icon: <IconX size={24} />,
                              message:
                                "There was an error updating your friends list",
                            });
                          }
                        }}
                      >
                        Accept friend request
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        icon={<IconX size={14} />}
                        px={5}
                        onClick={async () => {
                          showNotification({
                            id: "removeReq",
                            loading: true,
                            message: "Processing your request...",
                            disallowClose: true,
                            autoClose: false,
                          });
                          const token = await user.user.getIdToken();
                          const res = await fetch("/api/friendRequest/delete", {
                            method: "POST",
                            headers: {
                              Authorization: token || "",
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ friend: uid }),
                          });
                          const status = await res.json();
                          if (status?.success) {
                            user.privateDb.set({
                              friends__receivedRequests: arrayRemove(uid),
                            });
                            updateNotification({
                              id: "removeReq",
                              loading: false,
                              color: "lime",
                              icon: <IconCheck size={24} />,
                              message: "This friend request has been deleted",
                            });
                          } else {
                            updateNotification({
                              id: "removeReq",
                              loading: false,
                              color: "red",
                              icon: <IconX size={24} />,
                              message:
                                "There was an error removing this request",
                            });
                          }
                        }}
                      >
                        <Text size="sm">Decline friend request</Text>
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
                {!isFriend && pendingFriendReq && (
                  <Menu width={200} position="top">
                    <Menu.Target>
                      <Tooltip label="Pending friend request">
                        <ActionIcon size="lg" variant="light">
                          <IconArrowsUpDown size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        color="red"
                        icon={<IconX size={14} />}
                        py={2}
                        px={5}
                        onClick={async () => {
                          showNotification({
                            id: "cancelReq",
                            loading: true,
                            message: "Processing your request...",
                            disallowClose: true,
                            autoClose: false,
                          });
                          const token = await user.user.getIdToken();
                          const res = await fetch("/api/friendRequest/cancel", {
                            method: "POST",
                            headers: {
                              Authorization: token || "",
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ friend: uid }),
                          });
                          const status = await res.json();
                          if (status?.success) {
                            user.privateDb.set({
                              friends__sentRequests: arrayRemove(uid),
                            });
                            updateNotification({
                              id: "cancelReq",
                              loading: false,
                              color: "lime",
                              icon: <IconCheck size={24} />,
                              message: `Your friend request has been cancelled`,
                            });
                          } else {
                            updateNotification({
                              id: "cancelReq",
                              loading: false,
                              color: "red",
                              icon: <IconX size={24} />,
                              message:
                                "There was an error cancelling your friend request",
                            });
                          }
                        }}
                      >
                        <Text size="sm">Cancel friend request</Text>
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
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
          <Loader
            color={theme.colorScheme === "dark" ? "dark" : "gray"}
            size="md"
            variant="dots"
          />
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
