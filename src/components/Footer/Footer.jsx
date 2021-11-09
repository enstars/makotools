import { NavLink } from "react-router-dom";
import "./Footer.scss";

function Header() {
    return (
        <footer className="es-footer">
            <div className="es-header__content">
                Ensemble Square /
                {" "}
                <NavLink to="/privacy-policy">Privacy Policy</NavLink>
            </div>
        </footer>
    );
}

export default Header;
