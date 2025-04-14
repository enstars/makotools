import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const githubResponse = await fetch(
      "https://api.github.com/repos/enstars/makotools/commits?per_page=1"
    );
    const json = await githubResponse.json();
    const firstCommit = json[0];
    const dataToSend = {
      commit_url: firstCommit.html_url,
      commit_date: firstCommit.commit.author.date,
    };
    return res.status(200).send(dataToSend);
  } catch (e) {
    return res.status(500).send(e);
  }
};

export default handler;
