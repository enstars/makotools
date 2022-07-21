// https://enstars.github.io/enstars-tl/jp/cards.json

import { getData } from "../../services/ensquare";

export default async function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}
