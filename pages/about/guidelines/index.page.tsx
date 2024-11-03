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
            <blockquote key={0} />,
            <p key={1} />,
            <b key={2} />,
            <h2 key={3} />,
            <ul key={4} />,
            <li key={5} />,
            <a href="/issues" key={6} />,
            <a href="https://www.contributor-covenant.org" key={7} />,
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
