import {
  ActionIcon,
  Alert,
  Box,
  Container,
  Group,
  Loader,
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
  IconDiscountCheck,
  IconHearts,
} from "@tabler/icons-react";
import { useRef, Fragment, useState, useEffect, useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useMediaQuery } from "@mantine/hooks";
import useSWR, { SWRConfig } from "swr";

import EditProfileModal from "./components/customization/EditProfileModal";
import ProfilePicModal from "./components/profilePicture/ProfilePicModal";
import RemoveFriendModal from "./components/RemoveFriendModal";
import ProfileAvatar from "./components/profilePicture/ProfileAvatar";
import ProfileButtons from "./components/ProfileButtons";
import ProfileStats from "./components/ProfileStats";
import CardCollections from "./components/collections/CardCollections";

import { getLayout, useSidebarStatus } from "components/Layout";
import { Locale, QuerySuccess, UserData, UserLoggedIn } from "types/makotools";
import getServerSideUser from "services/firebase/getServerSideUser";
import { getLocalizedDataArray } from "services/data";
import { parseStringify } from "services/utilities";
import useUser from "services/firebase/user";
import BioDisplay from "components/sections/BioDisplay";
import Picture from "components/core/Picture";
import { CONSTANTS } from "services/makotools/constants";
import { GameCard, GameCharacter, GameUnit } from "types/game";
import { getFirestoreUserProfile } from "services/firebase/firestore";

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
  const user = useUser();

  const cardsData: GameCard[] = useMemo(
    () => cardsQuery.data,
    [cardsQuery.data]
  );
  const characters: GameCharacter[] = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const {
    data: profileData,
    isLoading,
    mutate,
  } = useSWR<UserData>([`/user/${uid}`, user], getFirestoreUserProfile);

  // hooks
  const units: GameUnit[] = useMemo(() => unitsQuery.data, [unitsQuery.data]);
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);

  const [embla, setEmbla] = useState<Embla | null>(null);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openPicModal, setOpenPicModal] = useState<boolean>(false);
  const [openRemoveFriendModal, setRemoveFriendModal] =
    useState<boolean>(false);

  const [profileState, setProfileState] = useState({
    profile__banner: profile.profile__banner,
    name: profile.name,
    profile__pronouns: profile.profile__pronouns,
    profile__start_playing: profile.profile__start_playing,
    profile__bio: profile.profile__bio,
    profile__picture: profile.profile__picture,
    profile__fave_charas: profile.profile__fave_charas,
    profile__fave_units: profile.profile__fave_units,
    profile__show_faves: profile.profile__show_faves,
  });
  const { collapsed } = useSidebarStatus();
  const isOwnProfile = user.loggedIn && user.db.suid === profile.suid;

  const saveProfileChanges = () => {
    if (!user.loggedIn) return;
    if (profileData) {
      setOpenEditModal(false);
      setProfileState({
        profile__banner: profileState.profile__banner,
        name: profileState.name,
        profile__pronouns: profileState.profile__pronouns,
        profile__start_playing: profileState.profile__start_playing,
        profile__bio: profileState.profile__bio,
        profile__picture: profileState.profile__picture,
        profile__fave_charas: profileState.profile__fave_charas,
        profile__fave_units: profileState.profile__fave_units,
        profile__show_faves: profileState.profile__show_faves,
      });

      user.db.set({
        profile__banner: profileState.profile__banner,
        name: profileState.name,
        profile__pronouns: profileState.profile__pronouns,
        profile__start_playing: profileState.profile__start_playing,
        profile__bio: profileState.profile__bio,
        profile__picture: profileState.profile__picture,
        profile__fave_charas: profileState.profile__fave_charas,
        profile__fave_units: profileState.profile__fave_units,
        profile__show_faves: profileState.profile__show_faves,
      });

      const newData: UserData = {
        ...profileData,
        profile__banner: profileState.profile__banner,
        name: profileState.name,
        profile__pronouns: profileState.profile__pronouns,
        profile__start_playing: profileState.profile__start_playing,
        profile__bio: profileState.profile__bio,
        profile__picture: profileState.profile__picture,
        profile__fave_charas: profileState.profile__fave_charas,
        profile__fave_units: profileState.profile__fave_units,
        profile__show_faves: profileState.profile__show_faves,
      };

      mutate(newData);
    }
  };

  // friend Variables
  const friendsData = (user as UserLoggedIn).privateDb?.friends__list || [];
  const outgoingData =
    (user as UserLoggedIn).privateDb?.friends__sentRequests || [];
  const incomingData =
    (user as UserLoggedIn).privateDb?.friends__receivedRequests || [];
  const isFriend =
    !!user.loggedIn && !isOwnProfile && friendsData.includes(uid);
  const isOutgoingFriendReq =
    !!user.loggedIn && !isOwnProfile && outgoingData.includes(uid);
  const isIncomingFriendReq =
    !!user.loggedIn && !isOwnProfile && incomingData.includes(uid);

  useEffect(() => {
    embla?.reInit();
  }, [embla, collapsed]);

  function LoadingState() {
    return (
      <Container style={{ marginTop: "5%" }}>
        <Box style={{ textAlign: "center" }}>
          <Loader
            size={200}
            color={theme.primaryColor}
            style={{ display: "block" }}
          />
        </Box>
      </Container>
    );
  }

  return (
    <SWRConfig value={{ fallback: { "/api/user/get": user } }}>
      {profileData && !isLoading && (
        <div style={{ position: "relative" }}>
          <EditProfileModal
            opened={openEditModal}
            saveChanges={saveProfileChanges}
            openedFunction={setOpenEditModal}
            picModalFunction={setOpenPicModal}
            cards={cards}
            user={user}
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
              user={user}
              profile={profileData}
              profileState={profileState}
              externalSetter={setProfileState}
            />
          )}
          <RemoveFriendModal
            opened={openRemoveFriendModal}
            closeFunction={setRemoveFriendModal}
            user={user as UserLoggedIn}
            uid={uid}
            profile={profileData}
          />
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
                      {profileData.profile__banner?.map((c: number) => (
                        <Carousel.Slide key={c}>
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
                      ))}
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
                    : 250,
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
              {isOwnProfile && user.db?.admin?.disableTextFields && (
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
                    <Title order={1}>
                      {profileData.name || profileData.username}
                    </Title>
                    {profileData.admin?.administrator && (
                      <Tooltip label="This user is a verified MakoTools admin.">
                        <ActionIcon color={theme.primaryColor} size="lg">
                          <IconDiscountCheck size={30} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    {isFriend && (
                      <Tooltip
                        label={`${
                          profileData.name || profileData.username
                        } is your friend!`}
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
                {!user.loading ? (
                  <ProfileButtons
                    user={user}
                    uid={uid}
                    profile={profileData}
                    isFriend={isFriend}
                    isIncomingReq={isIncomingFriendReq}
                    isOutgoingReq={isOutgoingFriendReq}
                    setOpenEditModal={setOpenEditModal}
                    setRemoveFriendModal={setRemoveFriendModal}
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

          <CardCollections
            profile={profileData}
            uid={uid}
            cards={cardsData}
            units={units}
          />
        </div>
      )}
      {(!profileData || isLoading) && <LoadingState />}
    </SWRConfig>
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
          cards: cards.data.filter((c) => bannerIds.includes(c.id)),
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
  }
);
