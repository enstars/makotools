/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect, ReactElement } from "react";
import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconArrowLeft } from "@tabler/icons";
import { useAuthUser } from "next-firebase-auth";
import { ColorScheme } from "@mantine/core";

import { FirebaseUser, UserData } from "../../types/makotools";

import { getFirestoreUserData, setFirestoreUserData } from "./firestore";

const FirebaseUserContext = React.createContext<{
  firebaseUser: FirebaseUser;
  setUserDataKey: (data: any, callback?: () => any) => any;
}>({ firebaseUser: { loading: true }, setUserDataKey: () => {} });
export const useFirebaseUser = () => useContext(FirebaseUserContext);

function FirebaseUserProvider({
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
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser>(
    serverData?.user
      ? {
          loading: false,
          loggedIn: !!AuthUser.id,
          user: serverData.user,
          firestore: serverData?.firestore,
        }
      : {
          loggedIn: false,
        }
  );

  const setUserDataKey = (data: any, callback?: () => void) => {
    setFirestoreUserData(data, ({ status }) => {
      if (status === "success") {
        setFirebaseUser((f) => ({
          ...f,
          firestore: {
            ...f.firestore,
            ...data,
          },
        }));
        if (callback) callback();
      }
    });
  };

  console.log("firebase user auth ", firebaseUser);
  useEffect(() => {
    const userState = {
      loading: false,
      loggedIn: !!AuthUser.id,
      user: AuthUser,
    };

    if (userState.loggedIn) setFirebaseUser((s) => ({ ...s, ...userState }));

    if (userState.loggedIn) {
      const setFirestoreData = async () => {
        try {
          let currentUserData: UserData | undefined = undefined,
            fetchCount = 5;
          while (!currentUserData && fetchCount > 0 && AuthUser.id) {
            currentUserData = await getFirestoreUserData(AuthUser.id);
            fetchCount--;
          }
          if (!currentUserData)
            showNotification({
              title: "Error",
              message:
                "We had trouble fetching your user data. If this is your first time signing up, please refresh the page.",
              color: "red",
              icon: <IconAlertTriangle size={16} />,
            });
          else {
            setFirebaseUser((s) => ({ ...s, firestore: currentUserData }));
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
    }
  }, [AuthUser]);

  useEffect(() => {
    if (firebaseUser.loggedIn)
      setUserDataKey({ dark_mode: colorScheme === "dark" });
  }, [colorScheme]);
  // useEffect(() => {
  //   if (typeof firebaseUser.firestore.dark_mode !== "undefined") {
  //     setAppColorScheme(firebaseUser.firestore.dark_mode ? "dark" : "light");
  //   }
  // }, [firebaseUser]);

  return (
    <FirebaseUserContext.Provider value={{ firebaseUser, setUserDataKey }}>
      {children}
    </FirebaseUserContext.Provider>
  );
}

export default FirebaseUserProvider;
