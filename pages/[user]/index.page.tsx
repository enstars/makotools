import {
  ActionIcon,
  Alert,
  Anchor,
  Box,
  Center,
  Container,
  Group,
  Loader,
  Notification,
  Space,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import Link from "next/link";
import {
  IconAlertCircle,
  IconBrandPatreon,
  IconCheck,
  IconDiscountCheck,
  IconHearts,
  IconX,
} from "@tabler/icons-react";
import {
  useRef,
  Fragment,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Autoplay from "embla-carousel-autoplay";
import { useMediaQuery } from "@mantine/hooks";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import { omitBy } from "lodash";

import EditProfileModal, {
  EditingProfile,
} from "./components/customization/EditProfileModal";
import ProfilePicModal from "./components/profilePicture/ProfilePicModal";
import RemoveFriendModal from "./components/RemoveFriendModal";
import ProfileAvatar from "./components/profilePicture/ProfileAvatar";
import ProfileButtons from "./components/ProfileButtons";
import ProfileStats from "./components/ProfileStats";
import CardCollections from "./components/collections/CardCollections";

import { getLayout, useSidebarStatus } from "components/Layout";
import { Locale, QuerySuccess, UserData } from "types/makotools";
import getServerSideUser from "services/firebase/getServerSideUser";
import { getLocalizedDataArray } from "services/data";
import { parseStringify } from "services/utilities";
import useUser from "services/firebase/user";
import BioDisplay from "components/sections/BioDisplay";
import Picture from "components/core/Picture";
import { CONSTANTS } from "services/makotools/constants";
import { GameCard, GameCharacter, GameUnit } from "types/game";
import { getFirestoreUserProfile } from "services/firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userQueries } from "services/queries";
import { showNotification, updateNotification } from "@mantine/notifications";
import { arrayRemove, arrayUnion } from "firebase/firestore";

function PatreonBanner({ profile }: { profile: UserData }) {
  const { t } = useTranslation("user");
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
            {tier.NAME} (${tier.VALUE}) {t("patreonSupporter")}
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
  cardsQuery,
  charactersQuery,
  unitsQuery,
  locale,
}: {
  profile: UserData;
  uid: string;
  cards: GameCard[] | undefined;
  cardsQuery: QuerySuccess<GameCard[]>;
  charactersQuery: QuerySuccess<GameCharacter[]>;
  unitsQuery: QuerySuccess<GameUnit[]>;
  locale: Locale;
}) {
  const {
    user,
    userDB,
    privateUserDB,
    updatePrivateUserDB,
    updateUserDB,
    userDBError,
    isUserDBPending,
  } = useUser();

  const cardsData: GameCard[] = useMemo(
    () => cardsQuery.data,
    [cardsQuery.data]
  );
  const characters: GameCharacter[] = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const qc = useQueryClient();

  const {
    data: profileData,
    isPending: isProfileDataPending,
    error: profileDataError,
  } = useQuery({
    queryKey: userQueries.fetchProfileData(uid),
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1] || !uid) throw new Error("Could not find user");
      const userData = await getFirestoreUserProfile(queryKey[1]);
      if (userData) return userData;
      else throw new Error("Could not retrieve user data");
    },
    enabled: !!uid,
  });

  const sendFriendReq = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User does not exist");
      const token = await user.getIdToken();
      const res = await fetch("/api/friendRequest/add", {
        method: "POST",
        headers: {
          Authorization: token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friend: uid }),
      });

      const status = await res.json();
      if (!status.success) throw new Error("Could not send friend request");
    },
    onMutate: () => {
      showNotification({
        id: "friendReq",
        loading: true,
        message: t("processingRequest"),
        disallowClose: true,
        autoClose: false,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userQueries.fetchProfileData(uid) });
      updateNotification({
        id: "friendReq",
        loading: false,
        color: "lime",
        icon: <IconCheck size={24} />,
        message: "Your friend request was sent successfully!",
      });
    },
    onError: (error: Error) => {
      updateNotification({
        id: "friendReq",
        loading: false,
        color: "red",
        icon: <IconX size={24} />,
        title: "An error occured:",
        message: `Your friend request could not be processed: ${error.message}`,
      });
    },
  });

  const deleteFriendReq = useMutation({
    mutationFn: async () => {
      if (!privateUserDB || !user) throw new Error("User is not logged in");
      const token = await user.getIdToken();
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
        updatePrivateUserDB?.mutate({
          friends__receivedRequests: arrayRemove(uid),
        });
      } else {
        throw new Error("Could not delete friend request");
      }
    },
    onMutate: () => {
      showNotification({
        id: "removeReq",
        loading: true,
        message: t("processingRequest"),
        disallowClose: true,
        autoClose: false,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userQueries.fetchUserData(uid) });
      updateNotification({
        id: "removeReq",
        loading: false,
        color: "lime",
        icon: <IconCheck size={24} />,
        message: t("deleteFriendReq"),
      });
    },
    onError: () => {
      updateNotification({
        id: "removeReq",
        loading: false,
        color: "red",
        icon: <IconX size={24} />,
        message: t("deleteReqError"),
      });
    },
  });

  const cancelFriendReq = useMutation({
    mutationFn: async () => {
      if (!privateUserDB || !user) throw new Error("User is not logged in");
      const token = await user.getIdToken();
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
        updatePrivateUserDB?.mutate({
          friends__sentRequests: arrayRemove(uid),
        });
      } else {
        throw new Error("Could not cancel friend request");
      }
    },
    onMutate: () => {
      showNotification({
        id: "cancelReq",
        loading: true,
        message: t("processingReq"),
        disallowClose: true,
        autoClose: false,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userQueries.fetchUserData(uid) });
      updateNotification({
        id: "cancelReq",
        loading: false,
        color: "lime",
        icon: <IconCheck size={24} />,
        message: t("friendReqCancelled"),
      });
    },
    onError: () => {
      updateNotification({
        id: "cancelReq",
        loading: false,
        color: "red",
        icon: <IconX size={24} />,
        message: t("cancelError"),
      });
    },
  });

  const removeFriend = useMutation({
    mutationFn: async () => {
      if (!privateUserDB || !user) throw new Error("User is not logged in");
      const token = await user.getIdToken();
      const res = await fetch("/api/friend/delete", {
        method: "POST",
        headers: {
          Authorization: token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friend: uid }),
      });
      const status = await res.json();
      if (status?.success) {
        updatePrivateUserDB?.mutate({
          friends__list: arrayRemove(uid),
        });
      } else {
        throw new Error("Could not remove friend");
      }
    },
    onMutate: () => {
      setRemoveFriendModal(false);
      showNotification({
        id: "removeFriend",
        loading: true,
        message: t("processingRequest"),
        disallowClose: true,
        autoClose: false,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userQueries.fetchUserData(uid) });
      updateNotification({
        id: "removeFriend",
        loading: false,
        color: "lime",
        icon: <IconCheck size={24} />,
        message: "User was successfully removed from your friends list!",
      });
    },
    onError: () => {
      updateNotification({
        id: "removeFriend",
        loading: false,
        color: "red",
        icon: <IconX size={24} />,
        title: "An error occured:",
        message: t("removeError"),
      });
    },
  });

  const addFriend = useMutation({
    mutationFn: async () => {
      if (!user || !privateUserDB) throw new Error("User is not logged in");
      const token = await user.getIdToken();
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
        updatePrivateUserDB?.mutate({
          friends__receivedRequests: arrayRemove(uid),
          friends__list: arrayUnion(uid),
        });
      } else {
        throw new Error("Could not add friend");
      }
    },
    onMutate: () => {
      showNotification({
        id: "addFriend",
        loading: true,
        message: t("processingRequest"),
        disallowClose: true,
        autoClose: false,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userQueries.fetchUserData(uid) });
      updateNotification({
        id: "addFriend",
        loading: false,
        color: "lime",
        icon: <IconCheck size={24} />,
        message: t("friendAdded", {
          friend: profile.name || profile.username,
        }),
      });
    },
    onError: () => {
      updateNotification({
        id: "addFriend",
        loading: false,
        color: "red",
        icon: <IconX size={24} />,
        message: t("addError"),
      });
    },
  });

  // hooks
  const { t } = useTranslation("user");
  const units: GameUnit[] = useMemo(() => unitsQuery.data, [unitsQuery.data]);
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);

  const [embla, setEmbla] = useState<Embla | null>(null);
  const [editModalOpened, setOpenEditModal] = useState<boolean>(false);
  const [openPicModal, setOpenPicModal] = useState<boolean>(false);
  const [openRemoveFriendModal, setRemoveFriendModal] =
    useState<boolean>(false);

  const [profileState, setProfileState] = useState<
    EditingProfile | undefined
  >();
  const [showUpdateProfileSuccess, setShowUpdateProfileSuccess] =
    useState(false);
  const [showUpdateProfileError, setShowUpdateProfileError] = useState(false);

  useEffect(() => {
    if (!editModalOpened) setProfileState(undefined);
  }, [editModalOpened]);

  const updateUserData = useCallback(async () => {
    setOpenEditModal(false);
    const cleanedProfileState = omitBy(
      profileState,
      (v) => typeof v === "undefined"
    );
    if (cleanedProfileState) {
      updateUserDB?.mutate(cleanedProfileState);
    }
  }, [updateUserDB, userDB, profileState]);

  const { collapsed } = useSidebarStatus();
  const isOwnProfile = !!(userDB?.suid === profile.suid);

  const isFriend = useMemo(() => {
    if (privateUserDB)
      return !isOwnProfile && !!privateUserDB?.friends__list?.includes(uid);
    return false;
  }, [privateUserDB, isOwnProfile, uid]);

  const isOutgoingFriendReq = useMemo(() => {
    if (privateUserDB)
      return (
        !isOwnProfile && !!privateUserDB?.friends__sentRequests?.includes(uid)
      );
    return false;
  }, [privateUserDB, isOwnProfile, uid]);

  const isIncomingFriendReq = useMemo(() => {
    if (privateUserDB)
      return (
        !isOwnProfile &&
        !!privateUserDB?.friends__receivedRequests?.includes(uid)
      );
    return false;
  }, [privateUserDB, isOwnProfile, uid]);

  useEffect(() => {
    embla?.reInit();
  }, [embla, collapsed]);

  useEffect(() => {
    if (updateUserDB?.isSuccess) {
      setShowUpdateProfileSuccess(true);
      qc.invalidateQueries({ queryKey: userQueries.fetchProfileData(uid) });
    } else if (updateUserDB?.isError) {
      setShowUpdateProfileError(true);
    }
  }, [updateUserDB]);

  function LoadingState() {
    return (
      <Container mt="xl">
        <Center>
          <Loader />
        </Center>
      </Container>
    );
  }

  if (
    isProfileDataPending ||
    updateUserDB?.isPending ||
    (!userDB && !userDBError)
  ) {
    return <LoadingState />;
  }

  if (profileDataError || userDBError) {
    return (
      <Title mt={64} mb="sm">
        <Text component="span" inherit color="dimmed">
          500
        </Text>{" "}
        Could not load this profile
      </Title>
    );
  }

  if (profileData) {
    return (
      <div style={{ position: "relative" }}>
        {showUpdateProfileSuccess && (
          <Notification
            title="Success!"
            icon={<IconCheck />}
            color="lime"
            onClose={() => setShowUpdateProfileSuccess(false)}
          >
            Your profile was updated successfully
          </Notification>
        )}
        {showUpdateProfileError && (
          <Notification
            title="An error occurred"
            icon={<IconAlertCircle />}
            color="red"
            onClose={() => setShowUpdateProfileError(false)}
          >
            Your profile could not be updated. Please try again or
            <Anchor href="/issues">submit an issue</Anchor> if the problem is
            persistent.
          </Notification>
        )}
        <EditProfileModal
          opened={editModalOpened}
          saveChanges={updateUserData}
          openedFunction={setOpenEditModal}
          picModalFunction={setOpenPicModal}
          cards={cards}
          profile={profileData}
          profileState={profileState}
          setProfileState={setProfileState}
          characters={characters}
          units={units}
          locale={locale}
        />
        {openPicModal && (
          <ProfilePicModal
            opened={openPicModal}
            openedFunction={setOpenPicModal}
            cards={cards as GameCard[]}
            loggedIn={!!userDB ?? false}
            userDB={userDB}
            profileState={profileState}
            externalSetter={setProfileState}
          />
        )}
        {userDB && privateUserDB && (
          <RemoveFriendModal
            opened={openRemoveFriendModal}
            closeFunction={setRemoveFriendModal}
            removeFriendFunction={removeFriend.mutate}
            profile={profileData}
          />
        )}
        <Box sx={{ position: "relative" }}>
          {profileData.profile__banner &&
          profileData.profile__banner?.length ? (
            <Box mt="sm" sx={{ marginLeft: "-100%", marginRight: "-100%" }}>
              <Carousel
                slideSize="34%"
                height={isMobile ? 150 : 250}
                slideGap="xs"
                loop
                withControls={false}
                plugins={[autoplay.current]}
                getEmblaApi={setEmbla}
                draggable={profileData.profile__banner.length > 1}
              >
                {/* // doing this so we can surely have enough slides to loop in embla */}
                {(profileData.profile__banner.length > 1
                  ? [0, 1, 2, 3]
                  : [0]
                ).map((n) => (
                  <Fragment key={n}>
                    {profileData.profile__banner?.map((c: number) => {
                      if (c)
                        return (
                          <Carousel.Slide
                            key={`${c.toString()}${n.toString()}`}
                          >
                            <Picture
                              alt={`Card ${c}`}
                              srcB2={`assets/card_still_full1_${Math.abs(c)}_${
                                c > 0 ? "evolution" : "normal"
                              }.png`}
                              sx={{
                                height: "100%",
                              }}
                              radius="sm"
                            />
                          </Carousel.Slide>
                        );
                    })}
                  </Fragment>
                ))}
              </Carousel>
            </Box>
          ) : null}
          <Box
            sx={{
              position:
                profileData.profile__banner &&
                profileData.profile__banner?.length
                  ? "absolute"
                  : "static",
              marginTop:
                profileData.profile__banner &&
                profileData.profile__banner?.length
                  ? -60
                  : isMobile
                  ? 150
                  : 60,
            }}
          >
            <ProfileAvatar
              userInfo={profileData}
              border={`5px solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[9]
                  : theme.colors.gray[0]
              }`}
            />
          </Box>
          <Box
            sx={{
              marginTop:
                profileData.profile__banner &&
                profileData.profile__banner?.length
                  ? 50
                  : 0,
            }}
          >
            {isOwnProfile && userDB?.admin?.disableTextFields && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                sx={{ marginTop: "2vh" }}
              >
                <Trans
                  i18nKey="user:restricted"
                  components={[
                    <Text
                      key="link"
                      component={Link}
                      href="/issues"
                      sx={{ textDecoration: "underline" }}
                    />,
                  ]}
                />
              </Alert>
            )}
            <Space h="lg" />

            <Group position="apart">
              <Box>
                <Group align="center" spacing="xs">
                  <Title order={1}>
                    {profileData.name || profileData.username}
                  </Title>
                  {profileData.admin?.administrator && (
                    <Tooltip label={t("verified")}>
                      <ActionIcon color={theme.primaryColor} size="lg">
                        <IconDiscountCheck size={30} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  {isFriend && (
                    <Tooltip
                      label={t("friendTooltip", {
                        friend: profileData.name || profileData.username,
                      })}
                    >
                      <ActionIcon size="xl" color="pink">
                        <IconHearts />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
                <Text
                  inline
                  component="span"
                  color="dimmed"
                  weight={500}
                  size="lg"
                >
                  @{profileData?.username}
                  {profileData?.profile__pronouns &&
                    ` · ${profileData.profile__pronouns}`}
                </Text>
              </Box>
              {!isUserDBPending && !isProfileDataPending ? (
                <ProfileButtons
                  {...{
                    user,
                    uid,
                    isOwnProfile,
                    isFriend,
                    setRemoveFriendModal,
                  }}
                  sendFriendReq={sendFriendReq.mutate}
                  deleteFriendReq={deleteFriendReq.mutate}
                  cancelFriendReq={cancelFriendReq.mutate}
                  addFriendFunction={addFriend.mutate}
                  profile={profileData}
                  isIncomingReq={isIncomingFriendReq}
                  isOutgoingReq={isOutgoingFriendReq}
                  setRemoveFriendModal={setRemoveFriendModal}
                  openEditModal={() => {
                    setOpenEditModal(true);
                    setProfileState({
                      profile__banner: profileData.profile__banner,
                      name: profileData.name,
                      profile__pronouns: profileData.profile__pronouns,
                      profile__start_playing:
                        profileData.profile__start_playing,
                      profile__bio: profileData.profile__bio,
                      profile__picture: profileData.profile__picture,
                      profile__fave_charas: profileData.profile__fave_charas,
                      profile__fave_units: profileData.profile__fave_units,
                      profile__show_faves: profileData.profile__show_faves,
                    });
                  }}
                />
              ) : (
                <Loader
                  color={theme.colorScheme === "dark" ? "dark" : "gray"}
                  size="md"
                  variant="dots"
                />
              )}
            </Group>
            <PatreonBanner profile={profileData} />
            <ProfileStats
              profile={profileData}
              characters={characters}
              units={units}
            />
            {profileData?.profile__bio && (
              <BioDisplay
                rawBio={profileData.profile__bio}
                withBorder={false}
                // p={0}
                // sx={{ background: "transparent" }}
                my="md"
              />
            )}
          </Box>
        </Box>

        <CardCollections profile={profileData} cards={cardsData} />
      </div>
    );
  }
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

    const cardsQuery: any = await getLocalizedDataArray<GameCard>(
      "cards",
      locale,
      "id",
      ["id", "character_id", "rarity"]
    );
    const charactersQuery = await getLocalizedDataArray<GameCharacter>(
      "characters",
      locale,
      "character_id"
    );
    const unitsQuery = await getLocalizedDataArray<GameUnit>(
      "units",
      locale,
      "id",
      ["id", "name", "order", "image_color"]
    );
    if (cards.status === "error" || charactersQuery.status === "error")
      return { props: { cards: undefined } };
    const bannerIds = cards.data.filter((c) => c.rarity >= 4).map((c) => c.id);

    if (typeof params?.user !== "string" || !params.user.startsWith("@")) {
      return {
        notFound: true,
      };
    }
    const db = admin.firestore();
    const docCollection = db.collection("users");
    try {
      const querySnap = await docCollection
        .where("username", "==", params.user.replace("@", ""))
        .get();
      if (!querySnap.empty) {
        const profile = parseStringify(querySnap.docs[0].data());

        if (profile.migrated !== true) {
          await fetch(
            `${
              process.env.NODE_ENV === "development"
                ? "http://localhost:3000/api"
                : CONSTANTS.EXTERNAL_URLS.INTERNAL_APIS
            }/collections/migrate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userUID: querySnap.docs[0].id,
                existingCollection: profile.collection,
              }),
            }
          );
        }
        return {
          props: {
            profile,
            cards: cards.data.filter((c) => bannerIds.includes(c.id)) ?? [],
            charactersQuery: charactersQuery,
            unitsQuery: unitsQuery,
            uid: querySnap.docs[0].id,
            cardsQuery: cardsQuery,
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
    } catch (error) {
      console.error(error);
      return {
        notFound: true,
      };
    }
  }
);
