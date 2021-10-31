import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import Home from "../pages/Home";
import Cards from "../pages/Cards";
import Login from "../pages/Login";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/:path">
                    <Header />
                </Route>
            </Switch>
            <Switch>
                <main>
                    <Route path="/cards">
                        <Cards />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/">
                        <Home />
                    </Route>
                </main>
            </Switch>
            <Switch>
                <Route path="/:path">
                    <Footer />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
