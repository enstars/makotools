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
import { UserData } from "types/makotools";

function Requests() {
  const theme = useMantineTheme();
  const user = useUser();
  const [loadedProfiles, setLoadedProfiles] = useState<{
    [uid: string]: UserData;
  }>({});
  // console.log("cycle", loadedProfiles, Object.keys(loadedProfiles).length);
  // only load profiles needed on this page
  useEffect(() => {
    if (user.loggedIn) {
      let newLoadedProfiles: any = parseStringify(loadedProfiles);
      let actuallyNewLoadedProfiles = [];
      [
        ...(user.privateDb?.friends__list || []),
        ...(user.privateDb?.friends__receivedRequests || []),
      ].forEach((uid) => {
        if (!Object.keys(newLoadedProfiles).includes(uid)) {
          newLoadedProfiles[uid] = {};
          actuallyNewLoadedProfiles.push(uid);
        }
      });

      if (actuallyNewLoadedProfiles.length) {
        const db = getFirestore();
        let i = 0;
        while (i < Object.keys(newLoadedProfiles).length) {
          getDocs(
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
          ).then((usersQuery) => {
            usersQuery.forEach((doc) => {
              newLoadedProfiles[doc.id] = doc.data();
            });
          });
          i += 10;
        }
        setLoadedProfiles(newLoadedProfiles);
        console.log(loadedProfiles);
      }
    }
  }, [user, loadedProfiles]);
  if (!user.loggedIn) return null;
  return (
    <>
      <Title order={2}>Your friends</Title>
      {Object.keys(loadedProfiles).length === 0 && <Image alt="no friends :(" src={NoBitches} width={300} />}
      <Stack spacing="xs">
        {loadedProfiles &&
          Object.keys(loadedProfiles).map((uid) => {
            console.log(loadedProfiles[uid]);
            return Object.keys(loadedProfiles[uid]).length > 0 ? (
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
            ) : (
              <Card key={uid} px="md" py="xs">
                <Loader
                  color={theme.colorScheme === "dark" ? "dark" : "gray"}
                  size="lg"
                  variant="dots"
                />
              </Card>
            );
          })}
      </Stack>
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
                loadedProfiles && (
                  <Card key={uid} px="md" py="xs">
                    {loadedProfiles?.[uid]?.username ? (
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
