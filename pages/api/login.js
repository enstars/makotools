// ./pages/api/login
import { setAuthCookies, verifyIdToken } from "next-firebase-auth";
import initAuth, {
  syncFirestoreUserData,
} from "../../services/firebase/authentication"; // the module you created above

initAuth();

const handler = async (req, res) => {
  try {
    await setAuthCookies(req, res);
    const authToken = req.headers.authorization;
    const authUser = await verifyIdToken(authToken);
    console.log(authUser);
    syncFirestoreUserData(authToken.id);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Unexpected error." });
  }
  return res.status(200).json({ success: true });
};

export default handler;
