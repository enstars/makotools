import { BrowserRouter, Switch, Route } from "react-router-dom";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Home from "../../pages/Home";
import Characters from "../../pages/Characters";
import Character from "../../pages/Characters/Character";
import Cards from "../../pages/Cards";
import Settings from "../../pages/Settings";
import Login from "../../pages/Login";
import User from "../../pages/User";

function App() {
    return (
        <BrowserRouter>

            <Sidebar />
            <div className="content">
                <main>
                    <Switch>
                        <Route path="/cards">
                            <Cards />
                        </Route>
                        <Route path="/characters/:id">
                            <Character />
                        </Route>
                        <Route path="/characters">
                            <Characters />
                        </Route>
                        <Route path="/user">
                            <User />
                        </Route>
                        <Route path="/settings">
                            <Settings />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route exact path="/">
                            <Home />
                        </Route>
                    </Switch>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
