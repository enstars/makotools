import "./App.css";
import { Switch, Route } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import Home from "../pages/Home";
import Cards from "../pages/Cards";

function App() {
    return (
        <>
            <Switch>
                <Route path="/:path">
                    <Header />
                </Route>
            </Switch>
            <Switch>
                <Route path="/cards">
                    <Cards />
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
