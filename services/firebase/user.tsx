/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect, ReactElement } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useAuthUser } from "next-firebase-auth";
import { ColorScheme } from "@mantine/core";

import {
  getFirestorePrivateUserData,
  getFirestoreUserData,
  setFirestoreUserData,
} from "./firestore";

import {
  User,
  UserData,
  UserLoggedOut,
  UserPrivateData,
} from "types/makotools";
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
  user: User;
  userDB: UserData | undefined;
  privateUserDB: UserPrivateData | undefined;
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
}

const loadingUser: UserLoggedOut = {
  loading: false,
  loggedIn: false,
};

const UserContext = React.createContext<UserContextType>({
  user: loadingUser,
  userDB: undefined,
  privateUserDB: undefined,
  updateUserDB: undefined,
  updatePrivateUserDB: undefined,
  userDBError: null,
  privateUserDBError: null,
});
const useUser = () => useContext(UserContext);

export default useUser;
export function UserProvider({
  children,
  colorScheme,
  setAppColorScheme,
}: {
  children: ReactElement;
  colorScheme: ColorScheme;
  setAppColorScheme: (c: ColorScheme) => void;
}) {
  const AuthUser = useAuthUser();

  const qc = useQueryClient();

  const [user, setUser] = useState<User>(loadingUser);

  const authUserId = AuthUser.id === null ? undefined : AuthUser.id;

  const {
    data: userData,
    isPending: isUserDataPending,
    error: userError,
    isSuccess: userDataSuccess,
    isRefetching: isUserDataRefetching,
    isFetching: isUserDataFetching,
  } = useQuery({
    enabled: AuthUser.id !== null,
    queryKey: userQueries.fetchUserData(authUserId),
    queryFn: async () => {
      if (!authUserId) return null;
      const currentUserData = await getFirestoreUserData(authUserId);
      if (currentUserData) {
        return currentUserData;
      } else {
        throw new Error("Could not find user data");
      }
    },
  });

  const { data: userDB, error: userDBError } = useQuery({
    enabled: !!userData,
    queryKey: userQueries.fetchUserDB(userData?.suid),
    queryFn: async () => {
      if (AuthUser.id) return await getFirestoreUserData(AuthUser.id);
      else throw new Error("Could not retrieve user DB");
    },
  });

  const { data: privateUserDB, error: privateUserDBError } = useQuery({
    enabled: !!userData,
    queryKey: userQueries.fetchPrivateUserDB(userData?.suid),
    queryFn: async () => {
      if (AuthUser.id) return await getFirestorePrivateUserData(AuthUser.id);
      else throw new Error("Could not retrieve private user DB");
    },
  });

  const updateUserDB = useMutation({
    mutationFn: async (newData: Partial<UserData>) => {
      await setFirestoreUserData(newData);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: userQueries.fetchUserDB(userData?.suid),
      });
      await qc.refetchQueries({
        queryKey: userQueries.fetchProfileData(userData?.suid),
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
        queryKey: userQueries.fetchPrivateUserDB(userData?.suid),
      });
      await qc.refetchQueries({
        queryKey: userQueries.fetchProfileData(userData?.suid),
      });
    },
  });

  useEffect(() => {
    if (userError) {
      console.error("a user error occurred", userError);
      notify("error", {
        title: "Error",
        message:
          "We had trouble fetching your user data. If this is your first time signing up, please try signing in again. If this error persists, please report at the Issues and Suggestions page.",
        color: "red",
        icon: <IconAlertTriangle size={16} />,
      });
      AuthUser.signOut();
    }
  }, [userError]);

  useEffect(() => {
    if (
      userDataSuccess &&
      userData &&
      !isUserDataRefetching &&
      !isUserDataFetching
    ) {
      setAppColorScheme(userData.dark_mode ? "dark" : "light");
      setUser((s) => ({
        ...s,
        loading: false as const,
        loggedIn: true as const,
        user: AuthUser,
      }));
    } else if (
      isUserDataPending ||
      isUserDataRefetching ||
      (isUserDataFetching && (!userData || !userDataSuccess))
    ) {
      setUser({
        loading: true,
        loggedIn: undefined,
      });
    } else {
      setUser({
        loading: false,
        loggedIn: false,
      });
    }
  }, [
    userDataSuccess,
    userData,
    isUserDataPending,
    isUserDataRefetching,
    isUserDataFetching,
  ]);

  useEffect(() => {
    if (!user.loading && user.loggedIn)
      updateUserDB.mutate({ dark_mode: colorScheme === "dark" });
  }, [colorScheme]);

  const contextValue = {
    user,
    userDB,
    privateUserDB,
    updateUserDB: updateUserDB,
    updatePrivateUserDB: updatePrivateUserDB,
    userDBError,
    privateUserDBError,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
