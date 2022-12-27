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
import { IconCheck, IconX } from "@tabler/icons";
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

import NoBitches from "./NoBitches.png";

import useUser from "services/firebase/user";
import { parseStringify } from "services/utilities";
import { FIRESTORE_MAXIMUM_CONCURRENT_ACCESS_CALLS } from "services/firebase/firestore";
import { UserData, UserLoggedIn } from "types/makotools";

function Requests() {
  const theme = useMantineTheme();
  const user = useUser();
  // only load profiles needed on this page
  const { data: profiles = {}, isLoading } = useSWR(
    user.loggedIn ? { key: "/settings/friends/Requests.tsx", user } : null,
    async (params: {
      user: UserLoggedIn;
    }): Promise<{
      [uid: string]: UserData;
    }> => {
      const { user } = params;
      let loadedProfiles: any = parseStringify(profiles);
      let profileIdsToLoad: string[] = [];
      [
        ...(user.privateDb?.friends__list || []),
        ...(user.privateDb?.friends__receivedRequests || []),
      ].forEach((uid) => {
        if (!Object.keys(loadedProfiles).includes(uid)) {
          profileIdsToLoad.push(uid);
        }
      });

      if (profileIdsToLoad.length) {
        const db = getFirestore();
        const profileIdChunks = chunk(
          profileIdsToLoad,
          FIRESTORE_MAXIMUM_CONCURRENT_ACCESS_CALLS
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
        Object.keys(profiles).length === 0 ? (
          <Image alt="no friends :(" src={NoBitches} width={300} />
        ) : (
          <Stack spacing="xs">
            {Object.keys(profiles).map((uid) => {
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
          <Title order={2}>Friend Requests</Title>
          <Stack>
            {(!user.privateDb?.friends__receivedRequests ||
              user.privateDb?.friends__receivedRequests?.length < 1) && (
              <Box
                sx={{
                  marginTop: 20,
                  marginBottom: 30,
                  padding: "10px 2px",
                  position: "relative",
                }}
              >
                <Text color="dimmed" sx={{ marginLeft: 30, marginTop: 10 }}>
                  No friend requests. You&apos;re all up to date!
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
            )}
            {user.privateDb?.friends__receivedRequests?.map(
              (uid) =>
                profiles && (
                  <Card key={uid} px="md" py="xs">
                    {!isLoading ? (
                      <Group spacing={0}>
                        <Text weight={700}>{profiles?.[uid]?.name}</Text>
                        <Text
                          ml={"xs"}
                          weight={500}
                          color="dimmed"
                          sx={{ "&&&": { flexGrow: 1 } }}
                        >
                          @{profiles?.[uid]?.username}
                        </Text>
                        <ActionIcon
                          color="green"
                          onClick={async () => {
                            const token = await user.user.getIdToken();
                            const res = await fetch("/api/friendAccept", {
                              method: "POST",
                              headers: {
                                Authorization: token || "",
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ friend: uid }),
                            });
                            const status = await res.json();
                            console.log(status);
                            if (status?.success) {
                              user.privateDb.set({
                                friends__receivedRequests: arrayRemove(uid),
                                friends__list: arrayUnion(uid),
                              });
                            }
                          }}
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          onClick={() => {
                            user.privateDb.set({
                              friends__receivedRequests: arrayRemove(uid),
                            });
                          }}
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      </Group>
                    ) : (
                      <Loader
                        color={theme.colorScheme === "dark" ? "dark" : "gray"}
                        size="lg"
                        variant="dots"
                      />
                    )}
                  </Card>
                )
            )}
          </Stack>
        </Box>
      )}
    </>
  );
}

export default Requests;
