import { TypographyStylesProvider } from "@mantine/core";
import HTMLContent from "raw-loader!./guidelines.html";

import PageTitle from "components/sections/PageTitle";
import { getLayout } from "components/Layout";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

function Page() {
  console.log(JSON.stringify(HTMLContent));
  const { t } = useTranslation("about/guidelines");
  return (
    <>
      <PageTitle title={t("title")} />
      <TypographyStylesProvider>
        <Trans
          i18nKey="about/guidelines:guidelines.html"
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
