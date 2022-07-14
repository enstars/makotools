import React, { useContext, useState, useEffect } from "react";
import { getFirestoreUserData, setFirestoreUserData } from "./initAuth";
import { showNotification } from "@mantine/notifications";

import { IconAlertTriangle, IconArrowLeft } from "@tabler/icons";
import { useAuthUser } from "next-firebase-auth";

const FirebaseUserContext = React.createContext();
export const useFirebaseUser = () => useContext(FirebaseUserContext);

function FirebaseUserProvider({ children, setAppColorScheme }) {
  const AuthUser = useAuthUser();
  const [firebaseUser, setFirebaseUser] = useState({
    loading: true,
  });

  const setUserDataKey = (data) => {
    setFirebaseUser({ ...firebaseUser, ...data });
    setFirestoreUserData(data);
  };

  console.log("firebase user auth ", firebaseUser);
  useEffect(() => {
    const userState = {
      loading: false,
      loggedIn: !!AuthUser.id,
      user: AuthUser,
    };
    setFirebaseUser(userState);

    if (userState.loggedIn) {
      const setFirestoreData = async () => {
        try {
          const currentUserData = await getFirestoreUserData(firebaseUser.id);
          setFirebaseUser({ ...userState, firestore: currentUserData });
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
    if (typeof firebaseUser.dark_mode !== "undefined") {
      setAppColorScheme(firebaseUser.dark_mode ? "dark" : "light");
    }
  }, [firebaseUser]);

  return (
    <FirebaseUserContext.Provider value={{ firebaseUser, setUserDataKey }}>
      {children}
    </FirebaseUserContext.Provider>
  );
}

export default FirebaseUserProvider;
