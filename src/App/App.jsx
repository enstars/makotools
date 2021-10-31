import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import Header from "../Header";
import Footer from "../Footer";
import Home from "../pages/Home";
import Cards from "../pages/Cards";
import Login from "../pages/Login";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    }, []);

    console.log(user);
    return (
        <>
            <Switch>
                <Route path="/:path">
                    <Header />
                </Route>
            </Switch>
            <span>{user ? user.email : ""}</span>
            <Switch>
                <Route path="/cards">
                    <Cards />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route exact path="/">
                    <Home />
                </Route>
            </Switch>
            <Switch>
                <Route path="/:path">
                    <Footer />
                </Route>
            </Switch>
        </>
    );
}

export default App;
