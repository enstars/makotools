import { NavLink } from "react-router-dom";
import { useAuth } from "../services/auth";
import "./Header.scss";

function Header() {
    const { user } = useAuth();
    return (
        <header className="es-header">
            <div className="es-header__content">
                <div className="es-header__branding">Ensemble Square</div>
                <div className="es-header__menu">
                    <nav className="es-header__links">
                        <NavLink to="/cards">Cards</NavLink>
                        <NavLink to="/events">Events</NavLink>
                        <NavLink to="/stories">Stories</NavLink>
                    </nav>
                    <div className="es-header__account">{user?.email}</div>
                </div>
            </div>
        </header>
    );
}

export default Header;
