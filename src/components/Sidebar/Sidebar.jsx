import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
// import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import ContentCopySharpIcon from "@mui/icons-material/ContentCopySharp";
import MilitaryTechSharpIcon from "@mui/icons-material/MilitaryTechSharp";
import ImportContactsSharpIcon from "@mui/icons-material/ImportContactsSharp";
import GroupSharpIcon from "@mui/icons-material/GroupSharp";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import { useAuth } from "../../services/auth";
import { EnsembleSquareLogo } from "../../assets/logo_square";
import "./Sidebar.scss";

function ProfileImage() {
    const { user } = useAuth();
    if (user) {
        return (
            <img alt={user.displayName} src={user.photoURL} referrerPolicy="no-referrer" />
        );
    }
    return (
        <AccountCircleSharpIcon />
    );
}

function Sidebar() {
    const location = useLocation();
    const [sidebarClasses, setSidebarClasses] = useState("es-sidebar__content");
    // let sidebarClasses = "";
    useEffect(() => {
        if (location.pathname === "/") {
            setSidebarClasses("es-sidebar__content es-sidebarLoaded es-transition");
        } else {
            setSidebarClasses("es-sidebar__content es-sidebarLoaded ");
        }
    }, [location]);

    return (
        <aside className="es-sidebar">
            <div className={sidebarClasses}>
                <NavLink className="es-sidebar__branding" to="/">
                    <EnsembleSquareLogo color="white" />
                    <span>Ensemble Square</span>
                </NavLink>
                <div className="es-sidebar__menu">
                    <nav className="es-sidebar__links">
                        {/* <NavLink to="/">
                            <HomeSharpIcon />
                            <span>Characters</span>
                        </NavLink> */}
                        <NavLink to="/characters">
                            <GroupSharpIcon />
                            <span>Characters</span>
                        </NavLink>
                        <NavLink to="/cards">
                            <ContentCopySharpIcon />
                            <span>Cards</span>
                        </NavLink>
                        <NavLink to="/events">
                            <MilitaryTechSharpIcon />
                            <span>Events</span>
                        </NavLink>
                        <NavLink to="/stories">
                            <ImportContactsSharpIcon />
                            <span>Stories</span>
                        </NavLink>
                        <NavLink to="/user">
                            <ProfileImage />
                            <span>Profile</span>
                        </NavLink>
                    </nav>
                    <div className="es-sidebar__links">
                        <NavLink to="/settings">
                            <SettingsSharpIcon />
                            <span>Settings</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
