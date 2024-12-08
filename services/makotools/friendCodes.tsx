import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getFirestoreUserFriendCodes } from "services/firebase/firestore";
import useUser from "services/firebase/user";
import { useDayjs } from "services/libraries/dayjs";
import { friendCodeQueries } from "services/queries";
import { generateUUID, getTimestamp } from "services/utilities";
import { EditingFriendCodesState, FriendCodeRegions } from "types/makotools";
import { IconCircleLetterB, IconX } from "@tabler/icons-react";
import { gameRegions } from "pages/settings/content/Region";

export const gameRegionsWithBasic = [
  ...gameRegions,
  { value: "ba", icon: <IconCircleLetterB /> },
];

export default function useFriendCodes(profileUID: string | null | undefined) {
  const qc = useQueryClient();
  const { user, userDB, privateUserDB } = useUser();
  const { dayjs } = useDayjs();

  const {
    data: friendCodes,
    isPending: areFriendCodesPending,
    error: friendCodesError,
  } = useQuery({
    queryKey: friendCodeQueries.fetchFriendCodes(profileUID ?? undefined),
    enabled: !!profileUID,
    queryFn: async ({ queryKey }) => {
      const uid = queryKey[1];
      try {
        return await getFirestoreUserFriendCodes(
          user,
          userDB,
          uid,
          privateUserDB
        );
      } catch (error) {
        throw new Error("Could not retrieve user friend codes");
      }
    },
  });

  const updateFriendCodesMutation = useMutation({
    mutationFn: async (
      friendCodes: EditingFriendCodesState & { id: string }
    ) => {
      console.log("mutating friend codes");
      if (!user || !userDB) throw new Error("User is not logged in");

      const currentFriendCodeId = friendCodes.id;

      const processedFriendCodes: FriendCodeRegions & { dateUpdated: string } =
        {
          ...friendCodes,
          id: !friendCodes.id.length ? generateUUID() : friendCodes.id,
          dateUpdated: getTimestamp(dayjs()),
        };

      const db = getFirestore();
      await setDoc(
        doc(db, `users/${user.id}/friend_codes/${processedFriendCodes.id}`),
        processedFriendCodes,
        { merge: !!currentFriendCodeId.length }
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: friendCodeQueries.fetchFriendCodes(profileUID ?? undefined),
      });
    },
    onError: (error) => {
      showNotification({
        id: "saveFriendCodeError",
        color: "red",
        icon: <IconX size={16} />,
        title: "Could not update friend codes",
        message: error.message,
      });
    },
  });

  return {
    friendCodes,
    areFriendCodesPending,
    friendCodesError,
    updateFriendCodesMutation,
  };
}
