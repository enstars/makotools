import { TypographyStylesProvider } from "@mantine/core";
import HTMLContent from "raw-loader!./guidelines.html";

import PageTitle from "../../../components/sections/PageTitle";
import { getLayout } from "../../../components/Layout";

function Page() {
  return (
    <>
      <PageTitle title="Community Guidelines" />
      <TypographyStylesProvider>
        <div dangerouslySetInnerHTML={{ __html: HTMLContent }} />
      </TypographyStylesProvider>
    </>
  );
}
Page.getLayout = getLayout({
  meta: { title: "Community Guidelines", desc: "" },
});
export default Page;
