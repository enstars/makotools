import Link from "next/link";

function Header() {
    return (
        <footer className="es-footer">
            <div className="es-header__content">
                Ensemble Square /{" "}
                <Link href="/privacy-policy">
                    <a>Privacy Policy</a>
                </Link>
            </div>
        </footer>
    );
}

export default Header;
