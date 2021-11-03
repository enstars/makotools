import { NavLink } from "react-router-dom";
import ContentCopySharpIcon from "@mui/icons-material/ContentCopySharp";
import MilitaryTechSharpIcon from "@mui/icons-material/MilitaryTechSharp";
import ImportContactsSharpIcon from "@mui/icons-material/ImportContactsSharp";
import GroupSharpIcon from "@mui/icons-material/GroupSharp";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import { useAuth } from "../../services/auth";
import EnsembleSquareLogo from "../../assets/logo_square";
import "./Sidebar.scss";

function ProfileImage() {
    const { user } = useAuth();
    if (user) {
        return (
            <>
                {/* <div>
                    <span className="es-sidebar__name">{user.displayName}</span>
                    <span className="es-sidebar__email">{user.email}</span>
                </div> */}
                <img alt={user.displayName} src={user.photoURL} referrerPolicy="no-referrer" />
            </>
        );
    }
    return (
        <>

        </>
    );
}

// function SidebarUser() {
//     const { user } = useAuth();
//     if (user) {
//         return (
//             <>
//                 {/* <div>
//                     <span className="es-sidebar__name">{user.displayName}</span>
//                     <span className="es-sidebar__email">{user.email}</span>
//                 </div> */}
//                 <img alt={user.displayName} src={user.photoURL} referrerpolicy="no-referrer" />
//             </>
//         );
//     }
//     return (
//         <>

//         </>
//     );
// }

function Sidebar() {
    return (
        <aside className="es-sidebar">
            <div className="es-sidebar__content">
                <div className="es-sidebar__branding">
                    <NavLink to="/">
                        <EnsembleSquareLogo />
                    </NavLink>
                </div>
                <div className="es-sidebar__menu">
                    <nav className="es-sidebar__links">
                        <NavLink to="/characters" activeClassName="current-page">
                            <GroupSharpIcon />
                            <span>Characters</span>
                        </NavLink>
                        <NavLink to="/cards" activeClassName="current-page">
                            <ContentCopySharpIcon />
                            <span>Cards</span>
                        </NavLink>
                        <NavLink to="/events" activeClassName="current-page">
                            <MilitaryTechSharpIcon />
                            <span>Events</span>
                        </NavLink>
                        <NavLink to="/stories" activeClassName="current-page">
                            <ImportContactsSharpIcon />
                            <span>Stories</span>
                        </NavLink>
                        <NavLink to="/user" activeClassName="current-page">
                            <ProfileImage />
                            <span>Profile</span>
                        </NavLink>
                    </nav>
                    <div className="es-sidebar__links">
                        <NavLink to="/settings" activeClassName="current-page">
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
