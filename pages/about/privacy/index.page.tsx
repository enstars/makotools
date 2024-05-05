import { TypographyStylesProvider } from "@mantine/core";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

import PageTitle from "components/sections/PageTitle";
import { getLayout } from "components/Layout";

function Page() {
  const { t } = useTranslation("about__privacy");
  return (
    <>
      <PageTitle title={t("title")} />
      <TypographyStylesProvider>
        <Trans
          i18nKey="about__privacy:privacy.html"
          components={[
            <p key={0} />,
            <h2 key={1} />,
            <ul key={2} />,
            <li key={3} />,
          ]}
        />
      </TypographyStylesProvider>
    </>
  );
}
Page.getLayout = getLayout({});
export default Page;
