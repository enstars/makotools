import { NavLink } from "react-router-dom";
import { useAuth } from "../services/auth";
import "./Footer.scss";

function Header() {
    return (
        <footer className="es-footer">
            <div className="es-header__content">
                Ensemble Square
            </div>
        </footer>
    );
}

export default Header;
