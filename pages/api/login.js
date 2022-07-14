// ./pages/api/login
import { setAuthCookies } from "next-firebase-auth";
import initAuth from "../../services/firebase/authentication"; // the module you created above

initAuth();

const handler = async (req, res) => {
  try {
    await setAuthCookies(req, res);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Unexpected error." });
  }
  return res.status(200).json({ success: true });
};

export default handler;
