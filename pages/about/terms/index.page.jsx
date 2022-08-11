import { TypographyStylesProvider } from "@mantine/core";

import TermsHTML from "raw-loader!./terms.html";

import Layout from "../../../components/Layout";
import PageTitle from "../../../components/PageTitle";

import { getLayout } from "../../../components/Layout";

function Page() {
  return (
    <>
      <PageTitle title="Terms of Service"></PageTitle>
      <TypographyStylesProvider
        dangerouslySetInnerHTML={{ __html: TermsHTML }}
      ></TypographyStylesProvider>
    </>
  );
}
Page.getLayout = getLayout({ meta: { title: "Terms of Service", desc: "" } });
export default Page;
