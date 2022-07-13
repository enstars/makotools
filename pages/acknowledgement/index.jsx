import Layout from "../../components/Layout";
import Title from "../../components/PageTitle";
import { TypographyStylesProvider } from "@mantine/core";
import { MAKOTOOLS } from "../../services/constants";
function PrivacyPolicy() {
  return (
    <>
      <Title title="About Translations"></Title>
      <TypographyStylesProvider>
        <p>
          MakoTools contains translated content both from volunteers, and from
          official sources.
        </p>
        <p>
          Volunteer translations (unofficial / fan translations) are not
          approved by Happy Elements, and are not official content.
          Additionally, these may be different from official translations used
          in official media, or in-game.
        </p>
        <h2>Incorrect Translations</h2>
        <p>
          If you believe any of the unofficial translations on this website are
          incorrect, feel free to contact us at{" "}
          <a href={MAKOTOOLS.EMAIL}>{MAKOTOOLS.EMAIL}</a>.
        </p>
        <p>
          We cannot provide help for incorrect official translations. In those
          cases, we recommend you contact Happy Elements directly yourself.
        </p>
      </TypographyStylesProvider>
    </>
  );
}

export default PrivacyPolicy;

PrivacyPolicy.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
