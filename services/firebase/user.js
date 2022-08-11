import React, { useContext, useState, useEffect } from "react";
import { getFirestoreUserData, setFirestoreUserData } from "./firestore";
import { showNotification } from "@mantine/notifications";

import { IconAlertTriangle, IconArrowLeft } from "@tabler/icons";
import { useAuthUser } from "next-firebase-auth";

const FirebaseUserContext = React.createContext();
export const useFirebaseUser = () => useContext(FirebaseUserContext);

function FirebaseUserProvider({
  children,
  colorScheme,
  setAppColorScheme,
  serverData,
}) {
  const AuthUser = useAuthUser();
  const [firebaseUser, setFirebaseUser] = useState(
    serverData.user
      ? {
          loading: false,
          loggedIn: !!AuthUser.id,
          user: serverData.user,
          firestore: serverData?.firestore,
        }
      : {
          loading: true,
        }
  );

  const setUserDataKey = (data) => {
    setFirebaseUser({
      ...firebaseUser,
      firestore: {
        ...firebaseUser.firestore,
        ...data,
      },
    });
    setFirestoreUserData(data);
  };

  // console.log("firebase user auth ", firebaseUser);
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
          const currentUserData = await getFirestoreUserData(AuthUser.id);
          setFirebaseUser((s) => ({ ...s, firestore: currentUserData }));
          if (currentUserData?.dark_mode)
            setAppColorScheme(currentUserData.dark_mode ? "dark" : "light");
        } catch (e) {
          console.log(e);
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
