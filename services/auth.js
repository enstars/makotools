import React, { useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from "next/router";

const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";

function AuthProvider({ children }) {
  const AuthUser = useAuthUser();
  const [user, setUser] = useState(AuthUser);
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      //   if (currentUser?.uid !== user?.uid) {
      //     // router.push("/");
      //   }
    });
  }, [router, user?.uid]);

  // console.log(user);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
