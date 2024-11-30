/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, ReactElement } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { AuthUserContext, useAuthUser } from "next-firebase-auth";
import { ColorScheme } from "@mantine/core";

import {
  getFirestorePrivateUserData,
  getFirestoreUserData,
  setFirestoreUserData,
} from "./firestore";

import { UserData, UserPrivateData } from "types/makotools";
import notify from "services/libraries/notify";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { userQueries } from "services/queries";
import { FieldValue } from "firebase/firestore";

interface UserContextType {
  user: AuthUserContext | null;
  userDB: UserData | null | undefined;
  privateUserDB: UserPrivateData | null | undefined;
  updateUserDB:
    | UseMutationResult<void, Error, Partial<UserData>, unknown>
    | undefined;
  updatePrivateUserDB:
    | UseMutationResult<
        void,
        Error,
        | Partial<UserPrivateData>
        | Partial<Record<keyof UserPrivateData, FieldValue>>,
        unknown
      >
    | undefined;
  userDBError: Error | null;
  privateUserDBError: Error | null;
  isUserDBPending: boolean;
}

const UserContext = React.createContext<UserContextType>({
  user: null,
  userDB: null,
  privateUserDB: null,
  updateUserDB: undefined,
  updatePrivateUserDB: undefined,
  userDBError: null,
  privateUserDBError: null,
  isUserDBPending: false,
});
const useUser = () => useContext(UserContext);

export default useUser;
export function UserProvider({
  children,
  colorScheme,
}: {
  children: ReactElement;
  colorScheme: ColorScheme;
}) {
  const AuthUser = useAuthUser();

  const qc = useQueryClient();

  const authUserId = AuthUser.id === null ? undefined : AuthUser.id;

  const {
    data: userDB,
    error: userDBError,
    isPending: isUserDBPending,
  } = useQuery({
    queryKey: userQueries.fetchUserDB(authUserId),
    queryFn: async () => {
      if (AuthUser.id) return await getFirestoreUserData(AuthUser.id);
      else return null;
    },
  });

  const { data: privateUserDB, error: privateUserDBError } = useQuery({
    enabled: !!authUserId,
    queryKey: userQueries.fetchPrivateUserDB(authUserId),
    queryFn: async () => {
      if (AuthUser.id) return await getFirestorePrivateUserData(AuthUser.id);
      else return null;
    },
  });

  const updateUserDB = useMutation({
    mutationFn: async (newData: Partial<UserData>) => {
      await setFirestoreUserData(newData);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: userQueries.fetchUserDB(authUserId),
      });
    },
  });

  const updatePrivateUserDB = useMutation({
    mutationFn: async (
      newData:
        | Partial<UserPrivateData>
        | Partial<Record<keyof UserPrivateData, FieldValue>>
    ) => {
      await setFirestoreUserData(newData, true);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: userQueries.fetchPrivateUserDB(authUserId),
      });
    },
  });

  useEffect(() => {
    if (userDBError) {
      console.error("a user error occurred", userDBError);
      notify("error", {
        title: "Error",
        message:
          "We had trouble fetching your user data. If this is your first time signing up, please try signing in again. If this error persists, please report at the Issues and Suggestions page.",
        color: "red",
        icon: <IconAlertTriangle size={16} />,
      });
      AuthUser.signOut();
    }
  }, [userDBError]);

  useEffect(() => {
    if (userDB) updateUserDB.mutate({ dark_mode: colorScheme === "dark" });
  }, [colorScheme]);

  const contextValue = {
    user: AuthUser,
    userDB,
    privateUserDB,
    updateUserDB: updateUserDB,
    updatePrivateUserDB: updatePrivateUserDB,
    userDBError,
    privateUserDBError,
    isUserDBPending,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
