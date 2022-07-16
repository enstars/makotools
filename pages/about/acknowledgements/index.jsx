import Layout from "../../../components/Layout";
import Title from "../../../components/PageTitle";
import { Anchor, Text, TypographyStylesProvider } from "@mantine/core";
import { MAKOTOOLS } from "../../../services/constants";
function Acknowledgements() {
  return (
    <>
      <Title title="Acknowledgements"></Title>
      <TypographyStylesProvider>
        <p>
          Originally a dream of a certain TomoyaP, MakoTools has been built with
          help from various people within the fandom, including translators,
          proofreaders, developers, dataminers, game researchers, and a lot
          more.
        </p>
        <p>
          For the website&apos;s development, you can see our list of active
          contributors on{" "}
          <Anchor inherit href="https://github.com/enstars" target="_blank">
            GitHub
          </Anchor>
          .
        </p>
        <p>
          We&apos;ve received a lot of help from various teams, including The
          English Ensemble Stars Wiki, @enstarsENG, @enstimes, @cnstars_en,
          @enstars_link, @ESMiSC_EN, @ensemble_scans, and most recently
          @DaydreamGuides, and The Chinese Ensemble Stars Wiki.
        </p>
      </TypographyStylesProvider>
      <Text color="dimmed" size="xs">
        As for individuals, I cannot list everyone&apos;s names due to anonimity
        reasons, so I&apos;ll just list them by who they produce instead: Thanks
        to the MidorP, ChiakiP, YutaP, SoumaP wiki staff, the EveryoneP,
        TomoyaP, ToriP, 3AP, EveP (JunP), SoumaP, SubaruP, Mao+IzumiP, SubaruP
        &amp; RitsuP, LeoP, MadaraP, KanataP, HikariDormP, TatsumiP, ReiP,
        IbaraP, RitsuP translators, the HiiroP, EveryoneP, MakotoP, HokkeP,
        NagisaP, NatsumeP proofreaders, the NatsumeP, ArashiP developer, the
        ShinobuP, AkitoP, KogaP, KeitoP game researchers, the LeoP, KanataP
        loremaster, the SubaruP, RitsuP, ChiakiP, AiraP CN wiki staff, and my
        TsukasaP, ToriP, MakotoP, KaoruP, IzumiP, EichiP, LeoP friends!
      </Text>
    </>
  );
}

export default Acknowledgements;

Acknowledgements.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
