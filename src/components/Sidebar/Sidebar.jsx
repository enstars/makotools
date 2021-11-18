import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
// import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import ContentCopySharpIcon from "@mui/icons-material/ContentCopySharp";
import MilitaryTechSharpIcon from "@mui/icons-material/MilitaryTechSharp";
import ImportContactsSharpIcon from "@mui/icons-material/ImportContactsSharp";
import GroupSharpIcon from "@mui/icons-material/GroupSharp";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import { useAuth } from "../../services/auth";
import { EnsembleSquareLogo } from "../../../public/logo_square";

function ProfileImage() {
    // eslint-disable-next-line prefer-const
    let [user, setUser] = useState({
        displayName: "Logged Out",
        photoURL: "",
    });
    const authUser = useAuth();
    useEffect(() => {
        user = authUser.user;
        if (user) {
            setUser(user);
        }
    }, [authUser]);
    return (
        <img alt={user.displayName} src={user.photoURL} referrerPolicy="no-referrer" />
    );
}

function Sidebar() {
    const location = useRouter();
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
                <Link href="/">
                    <a className="es-sidebar__branding">
                        <EnsembleSquareLogo color="white" />
                        <span>Ensemble Square</span>
                    </a>
                </Link>
                <div className="es-sidebar__menu">
                    <nav className="es-sidebar__links">
                        <Link href="/characters">
                            <a>
                                <GroupSharpIcon />
                                <span>Characters</span>
                            </a>
                        </Link>
                        <Link href="/cards">
                            <a>
                                <ContentCopySharpIcon />
                                <span>Cards</span>
                            </a>
                        </Link>
                        <Link href="/events">
                            <a>
                                <MilitaryTechSharpIcon />
                                <span>Events</span>
                            </a>
                        </Link>
                        <Link href="/stories">
                            <a>
                                <ImportContactsSharpIcon />
                                <span>Stories</span>
                            </a>
                        </Link>
                        <Link href="/user">
                            <a>
                                <ProfileImage />
                                <span>Profile</span>
                            </a>
                        </Link>
                        <Link href="/settings">
                            <a>
                                <SettingsSharpIcon />
                                <span>Settings</span>
                            </a>
                        </Link>
                    </nav>
                    <div className="es-sidebar__links" />
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
