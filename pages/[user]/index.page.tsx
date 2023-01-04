import {
  ActionIcon,
  Alert,
  Box,
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
} from "@tabler/icons";
import { useRef, Fragment, useState, useEffect, useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useMediaQuery } from "@mantine/hooks";

import EditProfileModal from "./components/customization/EditProfileModal";
import MaoBanned from "./assets/MaoBanned.png";
import ProfilePicModal from "./components/profilePicture/ProfilePicModal";
import RemoveFriendModal from "./components/RemoveFriendModal";
import ProfileAvatar from "./components/profilePicture/ProfileAvatar";
import ProfileButtons from "./components/ProfileButtons";
import ProfileStats from "./components/ProfileStats";
import CardCollections from "./components/collections/CardCollections";

import { getLayout, useSidebarStatus } from "components/Layout";
import { Locale, QuerySuccess, UserData, UserLoggedIn } from "types/makotools";
import getServerSideUser from "services/firebase/getServerSideUser";
import { getAssetURL, getLocalizedDataArray } from "services/data";
import { parseStringify } from "services/utilities";
import { useDayjs } from "services/libraries/dayjs";
import useUser from "services/firebase/user";
import BioDisplay from "components/sections/BioDisplay";
import Picture from "components/core/Picture";
import { CONSTANTS } from "services/makotools/constants";
import { GameCard, GameCharacter, GameUnit } from "types/game";

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
  const cardsData: GameCard[] = useMemo(
    () => cardsQuery.data,
    [cardsQuery.data]
  );
  const characters: GameCharacter[] = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );
  const units: GameUnit[] = useMemo(() => unitsQuery.data, [unitsQuery.data]);
  // hooks
  const { dayjs } = useDayjs();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
  const user = useUser();

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

  return (
    <>
      <EditProfileModal
        opened={openEditModal}
        openedFunction={setOpenEditModal}
        picModalFunction={setOpenPicModal}
        cards={cards}
        user={user}
        profile={profile}
        profileState={profileState}
        setProfileState={setProfileState}
        characters={characters}
        units={units}
        locale={locale}
      />
      <ProfilePicModal
        opened={openPicModal}
        openedFunction={setOpenPicModal}
        cards={cards as GameCard[]}
        user={user}
        profile={profile}
        profileState={profileState}
        externalSetter={setProfileState}
      />
      <RemoveFriendModal
        opened={openRemoveFriendModal}
        closeFunction={setRemoveFriendModal}
        user={user as UserLoggedIn}
        uid={uid}
        profile={profile}
      />
      <Box sx={{ position: "relative" }}>
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
                )
              )}
            </Carousel>
          </Box>
        ) : null}
        <Box
          sx={{
            position:
              profile.profile__banner && profile.profile__banner?.length
                ? "absolute"
                : "static",
            marginTop:
              profile.profile__banner && profile.profile__banner?.length
                ? -60
                : isMobile
                ? 150
                : 250,
          }}
        >
          <ProfileAvatar
            src={
              profile.profile__picture && profile.profile__picture.id
                ? getAssetURL(
                    `assets/card_still_full1_${Math.abs(
                      profile.profile__picture.id
                    )}_${
                      profile.profile__picture.id > 0 ? "evolution" : "normal"
                    }.png`
                  )
                : MaoBanned.src
            }
            crop={
              profile.profile__picture && profile.profile__picture.crop
                ? profile.profile__picture.crop
                : undefined
            }
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
              profile.profile__banner && profile.profile__banner?.length
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
                    label={`${
                      profile?.name || profile.username
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
                @{profile.username}
                {profile?.profile__pronouns &&
                  ` · ${profile?.profile__pronouns}`}
              </Text>
            </Box>
            {!user.loading ? (
              <ProfileButtons
                user={user}
                uid={uid}
                profile={profile}
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
          <PatreonBanner profile={profile} />
          <ProfileStats
            profile={profile}
            characters={characters}
            units={units}
          />
          {profile?.profile__bio && (
            <BioDisplay
              rawBio={profile.profile__bio}
              withBorder={false}
              // p={0}
              // sx={{ background: "transparent" }}
              my="md"
            />
          )}
        </Box>
      </Box>

      <CardCollections
        profile={profile}
        uid={uid}
        cards={cardsData}
        units={units}
      />
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
