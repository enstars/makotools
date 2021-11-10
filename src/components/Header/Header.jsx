import { useState, useEffect } from "react";
import Link from 'next/link'
import { useRouter } from 'next/router'
import Breadcrumbs from "@mui/material/Breadcrumbs";

function BasicBreadcrumbs() {
    const location = useRouter();
    const [pathnames, setPathnames] = useState(location.pathname.split("/").filter((x) => x));

    useEffect(() => {
        setPathnames(location.pathname.split("/").filter((x) => x));
    }, [location]);

    return (
        <Breadcrumbs aria-label="Breadcrumb">
            <Link color="inherit" href="/">
                <a>@ Ensemble Square</a>
            </Link>
            {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;

                return last ? (
                    <span>
                        {value}
                    </span>
                ) : (
                    <Link color="inherit" to={to} key={to}>
                        <a>{value}</a>
                    </Link>
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
