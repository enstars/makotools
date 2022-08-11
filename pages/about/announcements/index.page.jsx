import { Anchor, Text, TypographyStylesProvider } from "@mantine/core";

import Layout, { getLayout } from "../../../components/Layout";
import PageTitle from "../../../components/PageTitle";
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

Page.getLayout = getLayout({});
export default Page;
