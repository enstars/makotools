import Layout from "../../../components/Layout";
import PageTitle from "../../../components/PageTitle";
import { TypographyStylesProvider } from "@mantine/core";
import TermsHTML from "raw-loader!./terms.html";

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

export default Page;

Page.getLayout = function getLayout(page, pageProps) {
  return (
    <Layout
      pageProps={pageProps}
      meta={{ title: "Terms of Service", desc: "" }}
    >
      {page}
    </Layout>
  );
};
