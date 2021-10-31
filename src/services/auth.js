import React, { useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser || { email: "test@test.com" });
        });
    }, []);

    console.log(user);
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
