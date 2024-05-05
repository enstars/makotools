import useTranslation from "next-translate/useTranslation";

import AnnouncementsList from "./components/AnnouncementsList";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";

function Page() {
  const { t } = useTranslation("about");
  return (
    <>
      <PageTitle title={t("linkNames.announcements")} mb={24} />
      <AnnouncementsList />
    </>
  );
}

Page.getLayout = getLayout({});
export default Page;
