import {
  ActionIcon,
  Box,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  DocumentData,
  documentId,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { chunk } from "lodash";
import { showNotification, updateNotification } from "@mantine/notifications";
import useTranslation from "next-translate/useTranslation";

import NoBitches from "./NoBitches.png";

import useUser from "services/firebase/user";
import { FIRESTORE_MAXIMUM_WHERE_VALUES } from "services/firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { friendQueries, userQueries } from "services/queries";
import { UserLoggedIn } from "types/makotools";

function Requests() {
  const qc = useQueryClient();
  const { t } = useTranslation("settings");
  const theme = useMantineTheme();
  const { user, userDB, privateUserDB, updatePrivateUserDB } = useUser();

  const yourBitches: string[] | undefined = user.loggedIn
    ? privateUserDB?.friends__list || []
    : [];

  const thirstyBitches: string[] | undefined = user.loggedIn
    ? privateUserDB?.friends__receivedRequests || []
    : [];

  const {
    data: friendProfiles,
    isPending: areFriendProfilesLoading,
    error: friendProfilesError,
  } = useQuery({
    queryKey: friendQueries.fetchFriendData(userDB?.suid),
    queryFn: async () => {
      if (!user.loggedIn) throw new Error("User is not logged in");
      const loadedProfiles: Partial<Record<string, DocumentData>> = {};
      const profilesToLoad = [
        ...(yourBitches ?? []),
        ...(thirstyBitches ?? []),
      ];
      if (profilesToLoad.length) {
        const db = getFirestore();
        const profileIdChunks = chunk(
          profilesToLoad,
          FIRESTORE_MAXIMUM_WHERE_VALUES
        );
        await Promise.all(
          profileIdChunks.map(async (ids) => {
            const usersQuery = await getDocs(
              query(collection(db, "users"), where(documentId(), "in", ids))
            );
            usersQuery.forEach((doc) => {
              loadedProfiles[doc.id] = doc.data();
            });
          })
        );
        return loadedProfiles;
      } else {
        return undefined;
      }
    },
    enabled: !!user.loggedIn && !!userDB?.suid,
  });

  const acceptFriendReq = useMutation({
    mutationFn: async ({ user, uid }: { user: UserLoggedIn; uid: string }) => {
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
        updatePrivateUserDB?.mutate({
          friends__receivedRequests: arrayRemove(uid),
          friends__list: arrayUnion(uid),
        });
      } else {
        throw new Error("Could no update friends list");
      }
    },
    onMutate: () => {
      showNotification({
        id: "addFriend",
        loading: true,
        message: "Processing your request...",
        disallowClose: true,
        autoClose: false,
      });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({
        queryKey: userQueries.fetchPrivateUserDB(
          variables.user.user.id ?? undefined
        ),
      });
      updateNotification({
        id: "addFriend",
        loading: false,
        color: "lime",
        icon: <IconCheck size={24} />,
        message: `${
          friendProfiles?.[variables.uid]?.name ||
          friendProfiles?.[variables.uid]?.username
        } is now your friend!`,
      });
    },
    onError: () => {
      updateNotification({
        id: "addFriend",
        loading: false,
        color: "red",
        icon: <IconX size={24} />,
        message: "There was an error updating your friends list",
      });
    },
  });

  const deleteFriendReq = useMutation({
    mutationFn: async ({ user, uid }: { user: UserLoggedIn; uid: string }) => {
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
        message: "Processing your request...",
        disallowClose: true,
        autoClose: false,
      });
    },
    onSuccess: (data, vars) => {
      qc.invalidateQueries({
        queryKey: userQueries.fetchPrivateUserDB(
          vars.user.user.id ?? undefined
        ),
      });
      updateNotification({
        id: "removeReq",
        loading: false,
        color: "lime",
        icon: <IconCheck size={24} />,
        message: "This friend request has been deleted",
      });
    },
    onError: () => {
      updateNotification({
        id: "removeReq",
        loading: false,
        color: "red",
        icon: <IconX size={24} />,
        message: "There was an error removing this request",
      });
    },
  });

  if (areFriendProfilesLoading) {
    return (
      <Loader
        color={theme.colorScheme === "dark" ? "dark" : "gray"}
        size="lg"
        variant="dots"
      />
    );
  }

  if (friendProfilesError || !user.loggedIn) {
    return (
      <Box>
        <Title order={3}>Could not load friends list</Title>
      </Box>
    );
  }

  return (
    <>
      <Title order={2}>Your friends</Title>
      {!yourBitches || yourBitches.length === 0 ? (
        <Box>
          <Image
            alt="no friends :("
            src={NoBitches}
            width={300}
            style={{
              borderRadius: 5,
              border: `1px solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[3]
                  : theme.colors.gray[3]
              }`,
            }}
          />
          <Text sx={{ marginTop: 20 }} color="dimmed">
            {t("friends.noBitches")}
          </Text>
        </Box>
      ) : (
        <Stack spacing="xs">
          {yourBitches &&
            yourBitches.map((uid) => {
              return (
                <Card
                  key={uid}
                  px="md"
                  py="xs"
                  component={Link}
                  href={`/@${friendProfiles?.[uid]?.username}`}
                >
                  <Group spacing={0}>
                    <Text weight={700}>{friendProfiles?.[uid]?.name}</Text>
                    <Text ml={"xs"} weight={500} color="dimmed">
                      @{friendProfiles?.[uid]?.username}
                    </Text>
                  </Group>
                </Card>
              );
            })}
        </Stack>
      )}
      <Box mt={20}>
        <Title order={2}>{t("friends.friendRequests")}</Title>
        {!thirstyBitches || thirstyBitches.length === 0 ? (
          <Box
            sx={{
              marginTop: 20,
              marginBottom: 30,
              padding: "10px 2px",
              position: "relative",
            }}
          >
            <Text color="dimmed" sx={{ marginLeft: 30, marginTop: 10 }}>
              {t("friends.noReqs")}
            </Text>
            <Box
              sx={{
                zIndex: -5,
                position: "absolute",
                top: 0,
                left: 0,
                margin: "-30px 0px 0px -10px",
                opacity: 0.05,
              }}
            >
              <IconCheck strokeWidth={5} size={100} />
            </Box>
          </Box>
        ) : (
          <Stack>
            {thirstyBitches &&
              thirstyBitches.map((uid) => (
                <Card key={uid} px="md" py="xs">
                  <Group spacing={0}>
                    <Text
                      weight={700}
                      component={Link}
                      href={`/@${friendProfiles?.[uid]?.username}`}
                    >
                      {friendProfiles?.[uid]?.name}
                    </Text>
                    <Text
                      ml={"xs"}
                      weight={500}
                      color="dimmed"
                      sx={{ "&&&": { flexGrow: 1 } }}
                      component={Link}
                      href={`/@${friendProfiles?.[uid]?.username}`}
                    >
                      @{friendProfiles?.[uid]?.username}
                    </Text>
                    <ActionIcon
                      color="green"
                      onClick={() => acceptFriendReq.mutate({ user, uid })}
                    >
                      <IconCheck size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => deleteFriendReq.mutate({ user, uid })}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
          </Stack>
        )}
      </Box>
    </>
  );
}

export default Requests;
