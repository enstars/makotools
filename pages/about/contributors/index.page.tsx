import { createStyles } from "@mantine/core";
import { useState } from "react";

import ContributorCard from "./components/ContributorCard";

import * as contributors from "data/contributors.json";
import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import useUser from "services/firebase/user";
import { UserData } from "types/makotools";
import getServerSideUser from "services/firebase/getServerSideUser";

const useStyles = createStyles((theme, params: any, getRef) => ({
  contributors: {
    ref: getRef("contributors"),
    // color: "green",
    // fontFamily: "Comic Sans MS, cursive",
    // border: "1px solid orange",
  },
}));

function Page({
  profiles,
}: {
  profiles: {
    [uid: string]: UserData["profile__banner" | "profile__picture"];
  };
}) {
  console.log("contributors", contributors, profiles);
  const { classes, cx } = useStyles({});
  const user = useUser();

  const [loadedProfiles, setLoadedProfiles] = useState<{
    [uid: string]: UserData;
  }>({});

  return (
    <>
      <PageTitle title="Contributors" />
      <ResponsiveGrid
        sx={{ marginTop: 20 }}
        alignItems="stretch"
        className={classes.contributors}
      >
        {contributors.map((contributor) => {
          return (
            <ContributorCard
              key={contributor.name + contributor.makotools}
              contributor={contributor}
            />
          );
        })}
      </ResponsiveGrid>
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ admin }) => {
  const db = admin.firestore();
  const docCollection = db.collection("users");

  let neededProfiles = contributors
    .filter((c) => c.admin)
    .map((c) => c.makotools.replace("@", ""));
  let profiles: any = {};

  try {
    const querySnap = await docCollection
      .where("username", "in", neededProfiles)
      .get();
    if (!querySnap.empty) {
      querySnap.forEach((doc) => {
        const data = doc.data() as UserData;
        profiles[doc.id] = {
          profile__banner: data.profile__banner || null,
          profile__picture: data.profile__picture || null,
        };
      });
    }

    return {
      props: { profiles },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { profiles },
    };
  }
});

Page.getLayout = getLayout({
  wide: true,
});
export default Page;
