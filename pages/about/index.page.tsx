import { TypographyStylesProvider } from "@mantine/core";

import { getLayout } from "../../components/Layout";
import PageTitle from "../../components/sections/PageTitle";

function Page() {
  return (
    <>
      <PageTitle title="About"></PageTitle>
      <TypographyStylesProvider>
        <p>
          MakoTools is a website containing information, tools, and a lot more
          to aid you in playing Ensemble Stars!! Music English Version, created
          in collaboration between EN:Link, The English / Chinese Ensemble Stars
          Wiki, and Daydream Guides.
        </p>
      </TypographyStylesProvider>
    </>
  );
}

Page.getLayout = getLayout({});
export default Page;
