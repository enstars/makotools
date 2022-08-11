import { Anchor, Text, TypographyStylesProvider } from "@mantine/core";

import Layout, { getLayout } from "../../../components/Layout";
import PageTitle from "../../../components/sections/PageTitle";
import { MAKOTOOLS } from "../../../services/constants";

import AnnouncementsList from "./components/AnnouncementsList";

function Page() {
  return (
    <>
      <PageTitle title="Announcements"></PageTitle>
      <AnnouncementsList />
    </>
  );
}

Page.getLayout = getLayout({});
export default Page;
