import { TypographyStylesProvider } from "@mantine/core";
import TermsHTML from "raw-loader!./terms.html";

import PageTitle from "components/sections/PageTitle";
import { getLayout } from "components/Layout";

function Page() {
  return (
    <>
      <PageTitle title="Terms of Service" />
      <TypographyStylesProvider>
        <div dangerouslySetInnerHTML={{ __html: TermsHTML }} />
      </TypographyStylesProvider>
    </>
  );
}
Page.getLayout = getLayout({ meta: { title: "Terms of Service", desc: "" } });
export default Page;
