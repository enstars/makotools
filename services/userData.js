import React, { useContext, useState, useEffect } from "react";
import { useAuth } from "./auth";
import { getFirestoreUserData, setFirestoreUserData } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const UserDataContext = React.createContext();
export const useUserData = () => useContext(UserDataContext);

function UserDataProvider({ children }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  const setUserDataKey = (data) => {
    setUserData({ ...userData, ...data });
    setFirestoreUserData(data);
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      console.log(222);
      console.log(currentUser);
      if (currentUser?.uid) {
        console.log(222222);
        const currentUserData = await getFirestoreUserData(currentUser.uid);
        // console.log(currentUserData);
        currentUserData.user = JSON.parse(currentUserData.user);
        setUserData(currentUserData);
      }
    });
  }, []);

  return (
    <UserDataContext.Provider value={{ userData, setUserDataKey }}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserDataProvider;
