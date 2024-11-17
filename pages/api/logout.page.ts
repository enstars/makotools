import { NextApiRequest, NextApiResponse } from "next";
import { unsetAuthCookies } from "next-firebase-auth";

import { initAuthentication } from "services/firebase/authentication";

try {
  initAuthentication();
} catch (e) {
  console.error(`Could not authenticate: ${(e as Error).message}`);
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await unsetAuthCookies(req, res);
  } catch (e) {
    return res.status(500).json({ error: "Unexpected error." });
  }
  return res.status(200).json({ success: true });
};

export default handler;
