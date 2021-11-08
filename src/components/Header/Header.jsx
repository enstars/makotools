import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import "./Header.scss";

function BasicBreadcrumbs() {
    const location = useLocation();
    const [pathnames, setPathnames] = useState(location.pathname.split("/").filter((x) => x));

    useEffect(() => {
        setPathnames(location.pathname.split("/").filter((x) => x));
    }, [location]);

    return (
        <Breadcrumbs aria-label="Breadcrumb">
            <NavLink color="inherit" to="/">
                @ Ensemble Square
            </NavLink>
            {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;

                return last ? (
                    <span>
                        {value}
                    </span>
                ) : (
                    <NavLink color="inherit" to={to} key={to}>
                        {value}
                    </NavLink>
                );
            })}
        </Breadcrumbs>

    );
}

function Header() {
    return (
        <header className="es-header">
            <BasicBreadcrumbs />
        </header>
    );
}

export default Header;
