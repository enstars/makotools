import { appSignInWithGoogle, appSignOut } from "../../services/firebase";

function Settings() {
    return (
        <div>
            <button className="button" onClick={appSignInWithGoogle} type="button">
                Sign in with google
            </button>
            <button className="button" onClick={appSignOut} type="button">
                Sign Out
            </button>
        </div>
    );
}
export default Settings;
