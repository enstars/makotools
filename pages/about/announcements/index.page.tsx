import AnnouncementsList from "./components/AnnouncementsList";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";

function Page() {
  return (
    <>
      <PageTitle title="Announcements" mb={24} />
      <AnnouncementsList />
    </>
  );
}

Page.getLayout = getLayout({});
export default Page;
