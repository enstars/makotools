import { useMemo, useState } from "react";
import { IconTool, IconTools } from "@tabler/icons-react";
import { Stack, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import ContributorCard from "./components/ContributorCard";

import * as contributors from "data/contributors.json";
import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import useUser from "services/firebase/user";
import { UserData } from "types/makotools";
import getServerSideUser from "services/firebase/getServerSideUser";
import SectionTitle from "pages/events/components/SectionTitle";

function Page({
  profiles,
}: {
  profiles: {
    [uid: string]: UserData["profile__banner" | "profile__picture"];
  };
}) {
  const user = useUser();
  const theme = useMantineTheme();

  const [loadedProfiles, setLoadedProfiles] = useState<{
    [uid: string]: UserData;
  }>({});

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const adminCards = useMemo(() => {
    return contributors
      .filter((c) => c.admin)
      .map((contributor) => {
        const userData = Object.values(profiles).filter(
          (p: any) => p.username === contributor.makotools.replace("@", "")
        )[0];
        return (
          <ContributorCard
            userInfo={contributor.admin ? userData : undefined}
            key={contributor.name + contributor.makotools}
            contributor={contributor}
          />
        );
      });
  }, [profiles]);
  return (
    <>
      <PageTitle title="Contributors" />
      <SectionTitle id="admins" title="Admins" Icon={IconTool} />
      {isMobile ? (
        <ResponsiveGrid sx={{ marginTop: 20 }} alignItems="stretch">
          {adminCards}
        </ResponsiveGrid>
      ) : (
        <Stack spacing="xs">{adminCards}</Stack>
      )}
      <SectionTitle id="admins" title="Contributors" Icon={IconTools} />
      <ResponsiveGrid sx={{ marginTop: 20 }} alignItems="stretch">
        {contributors
          .filter((c) => !c.admin)
          .map((contributor) => {
            const userData = Object.values(profiles).filter(
              (p: any) => p.username === contributor.makotools.replace("@", "")
            )[0];
            return (
              <ContributorCard
                userInfo={contributor.admin ? userData : undefined}
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
          username: data.username,
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
  meta: {
    title: "Contributors",
  },
  // wide: true,
});
export default Page;
