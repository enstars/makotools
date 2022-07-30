import Layout from "../../../components/Layout";
import PageTitle from "../../../components/PageTitle";
import { Anchor, Text, TypographyStylesProvider } from "@mantine/core";
import { MAKOTOOLS } from "../../../services/constants";
import SiteAnnouncements from "../../../components/core/SiteAnnouncements";

function Page() {
  return (
    <>
      <PageTitle title="Announcements"></PageTitle>
      <SiteAnnouncements />
    </>
  );
}

export default Page;

Page.getLayout = function getLayout(page, pageProps) {
  return <Layout pageProps={pageProps}>{page}</Layout>;
};
