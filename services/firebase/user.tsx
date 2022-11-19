/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect, ReactElement } from "react";
import { IconAlertTriangle } from "@tabler/icons";
import { useAuthUser } from "next-firebase-auth";
import { ColorScheme } from "@mantine/core";

import {
  User,
  UserData,
  UserLoading,
  UserPrivateData,
} from "../../types/makotools";

import {
  getFirestorePrivateUserData,
  getFirestoreUserData,
  setFirestoreUserData,
} from "./firestore";

import notify from "services/libraries/notify";

const loadingUser: UserLoading = {
  loading: true,
  loggedIn: undefined,
};

const UserContext = React.createContext<User>(loadingUser);
const useUser = () => useContext(UserContext);

export default useUser;
export function UserProvider({
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
          privateDb: serverData?.privateDb,
          refreshData: () => {},
        }
      : loadingUser
  );

  //   (data: any, callback?: () => void) => {
  //     console.log(1, user);
  //     if (user.loggedIn) {
  //       console.log(2);
  //       setFirestoreUserData(data, ({ status }) => {
  //         if (status === "success") {
  //           setUser((f: UserLoggedIn) => ({
  //             ...f,
  //             db: {
  //               ...f.db,
  //               ...data,
  //             },
  //           }));
  //           if (callback) callback();
  //         }
  //       });
  //     }
  //   },
  //   [user.loggedIn, user, setUser]
  // );

  // console.log("firebase user auth ", user);
  useEffect(() => {
    if (AuthUser.id) {
      const setFirestoreData = async () => {
        try {
          let currentUserData: UserData | undefined = undefined,
            fetchCount = 5;
          while (!currentUserData && fetchCount > 0 && AuthUser.id) {
            currentUserData = await getFirestoreUserData(AuthUser.id);
            fetchCount--;
          }
          if (typeof currentUserData !== "undefined" && AuthUser.id !== null) {
            const db: UserData = {
              ...currentUserData,
              set: (data: any, callback?: () => void) => {
                setFirestoreUserData(data, ({ status }) => {
                  if (status === "success") {
                    setFirestoreData();
                    if (callback) callback();
                  }
                });
              },
            };

            const privateDb: UserPrivateData = {
              ...(await getFirestorePrivateUserData(AuthUser.id)),
              set: (data: any, callback?: () => void) => {
                setFirestoreUserData(
                  data,
                  ({ status }) => {
                    if (status === "success") {
                      setFirestoreData();
                      if (callback) callback();
                    }
                  },
                  true
                );
              },
            };
            setUser((s) => ({
              ...s,
              loading: false as const,
              loggedIn: true as const,
              user: AuthUser,
              db,
              privateDb,
              refreshData: () => {
                setFirestoreData();
              },
            }));
            if (currentUserData?.dark_mode)
              setAppColorScheme(currentUserData.dark_mode ? "dark" : "light");
          } else {
            notify("error", {
              title: "Error",
              message:
                "We had trouble fetching your user data. If this is your first time signing up, please try signing in again. If this error persists, please report at the Issues and Suggestions page.",
              color: "red",
              icon: <IconAlertTriangle size={16} />,
            });
            AuthUser.signOut();
          }
        } catch (e) {
          notify("error", {
            title: "Uh oh!",
            message: `We ran into a problem with your data: ${JSON.stringify(
              e
            )}`,
            color: "red",
            icon: <IconAlertTriangle size={16} />,
          });
        }
      };
      setFirestoreData();
      setUser((s) => ({ ...s }));
    } else {
      setUser((s) => ({
        ...s,
        loading: false as const,
        loggedIn: false as const,
      }));
    }
  }, [AuthUser]);

  useEffect(() => {
    if (!user.loading && user.loggedIn)
      user.db.set({ dark_mode: colorScheme === "dark" });
  }, [colorScheme]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
