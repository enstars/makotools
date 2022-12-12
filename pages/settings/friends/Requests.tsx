import { ActionIcon, Card, Group, Stack, Text, Title } from "@mantine/core";
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
import { useEffect, useState } from "react";

import useUser from "services/firebase/user";
import { parseStringify } from "services/utilities";
import { UserData } from "types/makotools";

function Requests() {
  const user = useUser();
  const [loadedProfiles, setLoadedProfiles] = useState<{
    [uid: string]: UserData;
  }>({});
  console.log("cycle", loadedProfiles);
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
              where(documentId(), "in", [Object.keys(newLoadedProfiles)[i]])
            )
          ).then((usersQuery) => {
            usersQuery.forEach((doc) => {
              newLoadedProfiles[doc.id] = doc.data();
            });
            setLoadedProfiles(newLoadedProfiles);
          });
          i++;
        }
      }
    }
  }, [user, loadedProfiles]);
  if (!user.loggedIn) return null;
  return (
    <>
      <Title order={2}>Your friends</Title>
      <Stack spacing="xs">
        {user.privateDb.friends__list?.map((uid) => (
          <Card key={uid} px="md" py="xs">
            <Group spacing={0}>
              <Text weight={700}>{loadedProfiles?.[uid]?.name}</Text>
              <Text ml={"xs"} weight={500} color="dimmed">
                @{loadedProfiles?.[uid]?.username}
              </Text>
            </Group>
          </Card>
        ))}
      </Stack>
      {user.loggedIn && (
        <>
          <Title order={2}>Friend Requests</Title>
          <Stack>
            {user.privateDb?.friends__receivedRequests?.map(
              (uid) =>
                loadedProfiles?.[uid]?.suid && (
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
                )
            )}
          </Stack>
        </>
      )}
    </>
  );
}

export default Requests;
