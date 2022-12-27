import {
  ActionIcon,
  Alert,
  AspectRatio,
  Badge,
  Box,
  Group,
  Image,
  Loader,
  Paper,
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
import MaoBanned from "./MaoBanned.png";
import ProfilePicModal from "./components/ProfilePicModal";
import RemoveFriendModal from "./components/RemoveFriendModal";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileButtons from "./components/ProfileButtons";
import ProfileStats from "./components/ProfileStats";

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
import { GameCard, GameCharacter } from "types/game";

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
  charactersQuery,
  locale,
}: {
  profile: UserData;
  uid: string;
  cards: GameCard[] | undefined;
  charactersQuery: QuerySuccess<GameCharacter[]>;
  locale: Locale;
}) {
  const characters: GameCharacter[] = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );
  // hooks
  const { dayjs } = useDayjs();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
  const user = useUser();

  const [embla, setEmbla] = useState<Embla | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
  });

  // friend Variables
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isOutgoingFriendReq, setOutgoingFriendReq] = useState<boolean>(false);
  const [isIncomingFriendReq, setIncomingFriendReq] = useState<boolean>(false);
  const { collapsed } = useSidebarStatus();
  const friends: DocumentData[] = [];
  const outgoingReqs: DocumentData[] = [];
  const incomingReqs: DocumentData[] = [];
  const friendsData = (user as UserLoggedIn).privateDb?.friends__list || [];
  const outgoingData =
    (user as UserLoggedIn).privateDb?.friends__sentRequests || [];
  const incomingData =
    (user as UserLoggedIn).privateDb?.friends__receivedRequests || [];
  const totalFriendsData = [...friendsData, ...outgoingData, ...incomingData];
  const totalFriends: DocumentData[] = [];
  const friendCount: number = totalFriendsData.length || 0;

  useEffect(() => {
    const loadFriends = async (user: UserLoggedIn) => {
      const db = getFirestore();
      let i = 0;
      while (i < friendCount) {
        const usersQuery = await getDocs(
          query(
            collection(db, "users"),
            where(
              documentId(),
              "in",
              i + 10 < friendCount
                ? totalFriendsData.slice(i, i + 10)
                : totalFriendsData.slice(i, friendCount)
            )
          )
        );
        usersQuery.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          if (friendsData.includes(doc.id)) {
            friends.push(doc.data());
          } else if (outgoingData.includes(doc.id)) {
            outgoingReqs.push(doc.data());
          } else if (incomingData.includes(doc.id)) {
            incomingReqs.push(doc.data());
          }
          totalFriends.push(doc.data());
        });
        i += 10;
      }
      const notUrProfile = profile.suid !== user.db.suid;
      if (!notUrProfile) {
        setLoading(false);
      } else {
        const friend = friends.find((b) => b.suid === profile.suid);
        const youSentReq = outgoingReqs.find((b) => b.suid === profile.suid);
        const findFan = incomingReqs.find((b) => b.suid === profile.suid);
        if (friend) setIsFriend(true);
        if (youSentReq) setOutgoingFriendReq(true);
        if (findFan) setIncomingFriendReq(true);
        setLoading(false);
      }
    };
    if (user.loggedIn) {
      loadFriends(user);
    }
  }, [user, totalFriends]);

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
            position: "absolute",
            marginTop: -60,
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
        <Box sx={{ marginTop: 50 }}>
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
            {!loading ? (
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
          <ProfileStats profile={profile} characters={characters} />
          {profile?.profile__bio && (
            <BioDisplay
              rawBio={profile.profile__bio}
              withBorder={false}
              // p={0}
              // sx={{ background: "transparent" }}
              my="md"
            />
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
        </Box>
      </Box>
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
    const charactersQuery = await getLocalizedDataArray<GameCharacter>(
      "characters",
      locale,
      "character_id"
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
      return {
        props: {
          profile,
          cards: cards.data.filter((c) => bannerIds.includes(c.id)),
          charactersQuery: charactersQuery,
          uid: querySnap.docs[0].id,
          locale: locale as Locale,
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
