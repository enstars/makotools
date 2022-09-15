/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useContext,
  useState,
  useEffect,
  ReactElement,
  useCallback,
} from "react";
import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconArrowLeft } from "@tabler/icons";
import { useAuthUser } from "next-firebase-auth";
import { ColorScheme } from "@mantine/core";

import {
  User,
  UserData,
  UserLoading,
  UserLoggedIn,
} from "../../types/makotools";

import { getFirestoreUserData, setFirestoreUserData } from "./firestore";

const loadingUser: UserLoading = {
  loading: true,
  loggedIn: undefined,
};

const UserContext = React.createContext<User>(loadingUser);
export const useUser = () => useContext(UserContext);

function UserProvider({
  children,
  colorScheme,
  setAppColorScheme,
  serverData,
}: {
  children: ReactElement;
  colorScheme: ColorScheme;
  setAppColorScheme: (c: ColorScheme) => void;
  serverData: any;
}) {
  const AuthUser = useAuthUser();
  const [user, setUser] = useState<User>(
    serverData?.user
      ? {
          loading: false,
          loggedIn: !!AuthUser.id,
          user: serverData.user,
          db: serverData?.db,
        }
      : loadingUser
  );

  const setDb = useCallback(
    (data: any, callback?: () => void) => {
      if (user.loggedIn)
        setFirestoreUserData(data, ({ status }) => {
          if (status === "success") {
            setUser((f: UserLoggedIn) => ({
              ...f,
              db: {
                ...f.db,
                ...data,
              },
            }));
            if (callback) callback();
          }
        });
    },
    [user, setUser]
  );

  console.log("firebase user auth ", user);
  useEffect(() => {
    // if (userState.loggedIn) setUser((s) => ({ ...s, ...userState }));

    if (AuthUser.id) {
      const userState = {
        loading: false as const,
        loggedIn: true as const,
        user: AuthUser,
      };
      const setFirestoreData = async () => {
        try {
          let currentUserData: UserData | undefined = undefined,
            fetchCount = 5;
          while (!currentUserData && fetchCount > 0 && AuthUser.id) {
            currentUserData = await getFirestoreUserData(AuthUser.id);
            fetchCount--;
          }
          if (typeof currentUserData === "undefined") {
            showNotification({
              title: "Error",
              message:
                "We had trouble fetching your user data. If this is your first time signing up, please try signing in again. If this error persists, please report at the Issues and Suggestions page.",
              color: "red",
              icon: <IconAlertTriangle size={16} />,
            });
            AuthUser.signOut();
          } else {
            const db = {
              ...currentUserData,
              set: setDb,
            };
            setUser((s) => ({
              ...s,
              ...userState,
              db,
            }));
            if (currentUserData?.dark_mode)
              setAppColorScheme(currentUserData.dark_mode ? "dark" : "light");
          }
        } catch (e) {
          console.log("error: ", e);
          showNotification({
            title: "Problem with Firestore",
            message: JSON.stringify(e),
            color: "red",
            icon: <IconAlertTriangle size={16} />,
          });
        }
      };
      setFirestoreData();
    } else {
      const userState = {
        loading: false as const,
        loggedIn: false as const,
      };
      setUser((s) => ({ ...s, ...userState }));
    }
  }, [AuthUser]);

  useEffect(() => {
    if (!user.loading && user.loggedIn)
      setDb({ dark_mode: colorScheme === "dark" });
  }, [colorScheme]);
  // useEffect(() => {
  //   if (typeof user.db.dark_mode !== "undefined") {
  //     setAppColorScheme(user.db.dark_mode ? "dark" : "light");
  //   }
  // }, [user]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export default UserProvider;
