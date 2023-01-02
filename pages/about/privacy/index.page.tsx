import { TypographyStylesProvider } from "@mantine/core";

import PageTitle from "components/sections/PageTitle";
import { getLayout } from "components/Layout";

import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

function Page() {
  const { t } = useTranslation("about__privacy");
  return (
    <>
      <PageTitle title={t("title")} />
      <TypographyStylesProvider>
        <Trans
          i18nKey="about__privacy:privacy.html"
          components={[<p />, <h2 />, <ul />, <li />]}
        />
      </TypographyStylesProvider>
    </>
  );
}
Page.getLayout = getLayout({});
export default Page;
