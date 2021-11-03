import { NavLink } from "react-router-dom";
import { useAuth } from "../../services/auth";
import "./Header.scss";

function HeaderUser() {
    const { user } = useAuth();
    if (user) {
        return (
            <>
                <div>
                    <span className="es-header__name">{user.displayName}</span>
                    <span className="es-header__email">{user.email}</span>
                </div>
                <img alt={user.displayName} src={user.photoURL} />
            </>
        );
    }
    return (
        <>

        </>
    );
}

function Header() {
    return (
        <header className="es-header">
            <div className="es-header__content">
                <div className="es-header__branding"><NavLink to="/">Ensemble Square</NavLink></div>
                <div className="es-header__menu">
                    <nav className="es-header__links">
                        <NavLink to="/cards" activeClassName="current-page">Cards</NavLink>
                        <NavLink to="/events" activeClassName="current-page">Events</NavLink>
                        <NavLink to="/stories" activeClassName="current-page">Stories</NavLink>
                    </nav>
                    <div className="es-header__account"><HeaderUser /></div>
                </div>
            </div>
        </header>
    );
}

export default Header;
