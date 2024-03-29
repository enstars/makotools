import { TypographyStylesProvider } from "@mantine/core";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

import PageTitle from "components/sections/PageTitle";
import { getLayout } from "components/Layout";

function Page() {
  const { t } = useTranslation("about__guidelines");
  return (
    <>
      <PageTitle title={t("title")} />
      <TypographyStylesProvider>
        <Trans
          i18nKey="about__guidelines:guidelines.html"
          components={[
            <blockquote />,
            <p />,
            <b />,
            <h2 />,
            <ul />,
            <li />,
            <a href="/issues" />,
            <a href="https://www.contributor-covenant.org" />,
          ]}
        />
      </TypographyStylesProvider>
    </>
  );
}
Page.getLayout = getLayout({
  meta: { title: "Community Guidelines", desc: "" },
});
export default Page;
