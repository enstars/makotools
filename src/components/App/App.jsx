import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import ErrorBoundary from "../ErrorBoundary";
import Home from "../../pages/Home";
import Characters from "../../pages/Characters";
import Character from "../../pages/Characters/Character";
import Cards from "../../pages/Cards";
import Settings from "../../pages/Settings";
import Login from "../../pages/Login";
import User from "../../pages/User";
import NoMatch from "../../pages/NoMatch";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            {/* <Routes>
                <Route path="/" element={<Splash />} />
            </Routes> */}
            <div className="es-content__wrapper">
                <Sidebar />
                <div className="es-content">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ErrorBoundary>
                                    <Home />
                                </ErrorBoundary>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <>
                                    <Header />
                                    <main className="es-mainContent">
                                        <ErrorBoundary>
                                            <Routes>
                                                <Route
                                                    path="/cards"
                                                    element={<Cards />}
                                                />
                                                <Route
                                                    path="/characters/:id"
                                                    element={<Character />}
                                                />
                                                <Route
                                                    path="/characters"
                                                    element={<Characters />}
                                                />
                                                <Route
                                                    path="/user"
                                                    element={<User />}
                                                />
                                                <Route
                                                    path="/settings"
                                                    element={<Settings />}
                                                />
                                                <Route
                                                    path="/login"
                                                    element={<Login />}
                                                />
                                                <Route
                                                    path="/"
                                                    element={<Home />}
                                                />
                                                <Route
                                                    path="*"
                                                    element={<NoMatch />}
                                                />
                                            </Routes>
                                        </ErrorBoundary>
                                    </main>
                                    <Footer />
                                </>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
