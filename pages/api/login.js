// ./pages/api/login
import { setAuthCookies, verifyIdToken } from "next-firebase-auth";
import initAuth, {
  syncFirestoreUserData,
} from "../../services/firebase/authentication"; // the module you created above
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initAuth();

const db = getFirestore();

const handler = async (req, res) => {
  try {
    await setAuthCookies(req, res);
    const authToken = req.headers.authorization;
    const authUser = await verifyIdToken(authToken);
    console.log(authUser);
    // console.log(defaultFirestore);
    // initAuth();
    syncFirestoreUserData(db, authUser.id, FieldValue.serverTimestamp(), {
      email: authUser.email,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Unexpected error." });
  }
  return res.status(200).json({ success: true });
};

export default handler;
