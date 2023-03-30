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
  documentId,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { chunk } from "lodash";
import { showNotification, updateNotification } from "@mantine/notifications";
import useTranslation from "next-translate/useTranslation";

import NoBitches from "./NoBitches.png";

import useUser from "services/firebase/user";
import { parseStringify } from "services/utilities";
import { FIRESTORE_MAXIMUM_WHERE_VALUES } from "services/firebase/firestore";
import { UserData, UserLoggedIn } from "types/makotools";

function Requests() {
  const { t } = useTranslation("settings");
  const theme = useMantineTheme();
  const user = useUser();
  const yourBitches: string[] | undefined = (user as UserLoggedIn).privateDb
    ?.friends__list;
  const thirstyBitches: string[] | undefined = (user as UserLoggedIn).privateDb
    ?.friends__receivedRequests;
  // only load profiles needed on this page
  const { data: profiles = {}, isLoading } = useSWR(
    user.loggedIn ? "/settings/friends/Requests" : null,
    async (): Promise<{
      [uid: string]: UserData;
    }> => {
      let loadedProfiles: any = parseStringify(profiles);
      let profileIdsToLoad: string[] = [];
      [...(yourBitches || []), ...(thirstyBitches || [])].forEach((uid) => {
        if (!Object.keys(loadedProfiles).includes(uid)) {
          profileIdsToLoad.push(uid);
        }
      });

      if (profileIdsToLoad.length) {
        const db = getFirestore();
        const profileIdChunks = chunk(
          profileIdsToLoad,
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
      }

      return loadedProfiles;
    }
  );

  if (!user.loggedIn) return null;

  return (
    <>
      <Title order={2}>Your friends</Title>
      {!isLoading ? (
        !yourBitches || yourBitches.length === 0 ? (
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
                    href={`/@${profiles[uid].username}`}
                  >
                    <Group spacing={0}>
                      <Text weight={700}>{profiles?.[uid]?.name}</Text>
                      <Text ml={"xs"} weight={500} color="dimmed">
                        @{profiles[uid].username}
                      </Text>
                    </Group>
                  </Card>
                );
              })}
          </Stack>
        )
      ) : (
        <Loader
          color={theme.colorScheme === "dark" ? "dark" : "gray"}
          size="lg"
          variant="dots"
        />
      )}
      {user.loggedIn && (
        <Box sx={{ marginTop: 20 }}>
          <Title order={2}>{t("friends.friendRequests")}</Title>
          {!isLoading ? (
            !thirstyBitches || thirstyBitches.length === 0 ? (
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
                          href={`/@${profiles[uid].username}`}
                        >
                          {profiles?.[uid]?.name}
                        </Text>
                        <Text
                          ml={"xs"}
                          weight={500}
                          color="dimmed"
                          sx={{ "&&&": { flexGrow: 1 } }}
                          component={Link}
                          href={`/@${profiles[uid].username}`}
                        >
                          @{profiles?.[uid]?.username}
                        </Text>
                        <ActionIcon
                          color="green"
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
                                  profiles[uid].name || profiles[uid].username
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
                          <IconCheck size={16} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          onClick={async () => {
                            showNotification({
                              id: "removeReq",
                              loading: true,
                              message: "Processing your request...",
                              disallowClose: true,
                              autoClose: false,
                            });
                            const token = await user.user.getIdToken();
                            const res = await fetch(
                              "/api/friendRequest/delete",
                              {
                                method: "POST",
                                headers: {
                                  Authorization: token || "",
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ friend: uid }),
                              }
                            );
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
                          <IconX size={16} />
                        </ActionIcon>
                      </Group>
                    </Card>
                  ))}
              </Stack>
            )
          ) : (
            <Loader
              color={theme.colorScheme === "dark" ? "dark" : "gray"}
              size="lg"
              variant="dots"
            />
          )}
        </Box>
      )}
    </>
  );
}

export default Requests;
