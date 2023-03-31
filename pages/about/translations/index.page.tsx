import { TypographyStylesProvider } from "@mantine/core";

import PageTitle from "components/sections/PageTitle";
import { getLayout } from "components/Layout";
import { CONSTANTS } from "services/makotools/constants";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

function Page() {
  const { t } = useTranslation("about__translations");
  return (
    <>
      <PageTitle title={t("title")} />
      <TypographyStylesProvider>
        <p>{t("text.main")}</p>
        <p>{t("text.sub")}</p>
        <h2>{t("incorrectTls")}</h2>
        <p>
          <Trans
            i18nKey="about__translations:incorrect.unofficial"
            values={{ email: CONSTANTS.MAKOTOOLS.EMAIL }}
            components={[<a href={`mailto:${CONSTANTS.MAKOTOOLS.EMAIL}`} />]}
          />
        </p>
        <p>{t("incorrect.official")}</p>
      </TypographyStylesProvider>
    </>
  );
}
Page.getLayout = getLayout({});
export default Page;
