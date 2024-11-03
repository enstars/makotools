import { Anchor, Text, TypographyStylesProvider } from "@mantine/core";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
function Page() {
  const { t } = useTranslation("about__acknowledgements");
  return (
    <>
      <PageTitle title={t("title")} />
      <TypographyStylesProvider>
        <p>{t("text.main")}</p>
        <p>
          <Trans
            i18nKey="about__acknowledgements:text.development"
            components={[
              <Anchor
                key={0}
                inherit
                href="https://github.com/enstars"
                target="_blank"
              />,
            ]}
          />
        </p>
        <p>
          <Trans
            i18nKey="about__acknowledgements:text.accounts"
            components={[
              "https://ensemble-stars.fandom.com/",
              "https://twitter.com/enstarsENG",
              "https://twitter.com/enstimes",
              "https://twitter.com/cnstars_en",
              "https://twitter.com/enstars_link",
              "https://twitter.com/ESMiSC_EN",
              "https://twitter.com/ensemble_scans",
              "https://twitter.com/DaydreamGuides",
              "https://ensemblestars.huijiwiki.com",
            ].map((link) => (
              <Anchor inherit href={link} target="_blank" key={link} />
            ))}
          />
        </p>
      </TypographyStylesProvider>
      <Text color="dimmed" size="xs">
        And here&apos;s a special lovemail to everyone who helped individually,
        from the head developer! I cannot list everyone&apos;s names due to
        anonimity reasons, so I&apos;ll just list them by who they produce
        instead: Thanks to the MidoriP, ChiakiP, YutaP, SoumaP wiki staff, the
        TomoyaP, ToriP, EveryoneP, 3AP, EveP (JunP), RitsuP, SoumaP, Mao+IzumiP,
        SubaruP, SubaruP & RitsuP, LeoP, MadaraP, KanataP, HikariDormP,
        TatsumiP, ReikeiP, ReiP, IbaraP, MitsuruP, MidoriP, translators, the
        HiiroP, EveryoneP, MakotoP, HokkeP, NagisaP, NatsumeP, IbaraP
        proofreaders, the NatsumeP, ArashiP, NikiP developer, the ShinobuP,
        AkitoP, KogaP, KeitoP game researchers, the LeoP loremaster, the
        SubaruP, RitsuP, ChiakiP, AiraP, EveryoneP CN wiki staff, and my
        TsukasaP, ToriP, MakotoP, KaoruP, IzumiP, EichiP, LeoP, MikejimaP
        friends, and my special HiiAiP someone!
      </Text>
    </>
  );
}

Page.getLayout = getLayout({});
export default Page;
