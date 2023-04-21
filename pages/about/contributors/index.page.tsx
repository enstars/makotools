import { createStyles } from "@mantine/core";

import ContributorCard from "./components/ContributorCard";

import * as contributors from "data/contributors.json";
import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import ResponsiveGrid from "components/core/ResponsiveGrid";

const useStyles = createStyles((theme, params: any, getRef) => ({
  contributors: {
    ref: getRef("contributors"),
    // color: "green",
    // fontFamily: "Comic Sans MS, cursive",
    // border: "1px solid orange",
  },
}));

function Page() {
  console.log(contributors);
  const { classes, cx } = useStyles({});
  return (
    <>
      <PageTitle title="Contributors" />
      keito
      <ResponsiveGrid alignItems="stretch" className={classes.contributors}>
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

Page.getLayout = getLayout({});
export default Page;
