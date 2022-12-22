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
import { useEffect, useState } from "react";

import NoBitches from "./NoBitches.png";

import useUser from "services/firebase/user";
import { parseStringify } from "services/utilities";
import { UserData, UserLoggedIn } from "types/makotools";

function Requests() {
  const theme = useMantineTheme();
  const user = useUser();
  const [loadedProfiles, setLoadedProfiles] = useState<{
    [uid: string]: UserData;
  }>({});
  const yourBitches: string[] | undefined = (user as UserLoggedIn).privateDb
    ?.friends__list;
  const thirstyBitches: string[] | undefined = (user as UserLoggedIn).privateDb
    ?.friends__receivedRequests;
  const [loading, setLoading] = useState<boolean>(true);
  // console.log("cycle", loadedProfiles, Object.keys(loadedProfiles).length);
  // only load profiles needed on this page
  useEffect(() => {
    const loadProfiles = async (user: UserLoggedIn) => {
      let newLoadedProfiles: any = parseStringify(loadedProfiles);
      let actuallyNewLoadedProfiles = [];
      [...(yourBitches || []), ...(thirstyBitches || [])].forEach((uid) => {
        if (!Object.keys(newLoadedProfiles).includes(uid)) {
          newLoadedProfiles[uid] = {};
          actuallyNewLoadedProfiles.push(uid);
        }
      });

      if (actuallyNewLoadedProfiles.length) {
        const db = getFirestore();
        let i = 0;
        while (i < Object.keys(newLoadedProfiles).length) {
          const usersQuery = await getDocs(
            query(
              collection(db, "users"),
              where(
                documentId(),
                "in",
                i + 10 < Object.keys(newLoadedProfiles).length
                  ? Object.keys(newLoadedProfiles).slice(i, i + 10)
                  : Object.keys(newLoadedProfiles).slice(
                      i,
                      Object.keys(newLoadedProfiles).length
                    )
              )
            )
          );
          usersQuery.forEach((doc) => {
            newLoadedProfiles[doc.id] = doc.data();
          });
          i += 10;
        }
        setLoadedProfiles(newLoadedProfiles);
      }
      setLoading(false);
    };
    if (user.loggedIn) {
      loadProfiles(user);
    }
  }, [user, loadedProfiles]);
  if (!user.loggedIn) return null;
  return (
    <>
      <Title order={2}>Your friends</Title>
      {!loading ? (
        !yourBitches || yourBitches.length === 0 ? (
          <Box>
            <Image alt="no friends :(" src={NoBitches} width={300} />
            <Text sx={{ marginTop: 20 }} color="dimmed">
              Uh oh, looks like someone needs to make some friends!
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
                    href={`/@${loadedProfiles[uid].username}`}
                  >
                    <Group spacing={0}>
                      <Text weight={700}>{loadedProfiles?.[uid]?.name}</Text>
                      <Text ml={"xs"} weight={500} color="dimmed">
                        @{loadedProfiles[uid].username}
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
          {!loading ? (
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
            ) : (
              <Stack>
                {thirstyBitches &&
                  thirstyBitches.map((uid) => (
                    <Card key={uid} px="md" py="xs">
                      <Group spacing={0}>
                        <Text weight={700}>{loadedProfiles?.[uid]?.name}</Text>
                        <Text
                          ml={"xs"}
                          weight={500}
                          color="dimmed"
                          sx={{ "&&&": { flexGrow: 1 } }}
                        >
                          @{loadedProfiles?.[uid]?.username}
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
