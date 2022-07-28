import Layout from "../../components/Layout";
import PageTitle from "../../components/PageTitle";
import { Accordion, Anchor, TypographyStylesProvider } from "@mantine/core";
import { MAKOTOOLS } from "../../services/constants";
function Page() {
  return (
    <>
      <PageTitle title="Issues and Suggestions"></PageTitle>
      <TypographyStylesProvider>
        <p>
          Did you run into an error on the website? Do you have a suggestion to
          improve the site? You&apos;ve come to the right place!
        </p>
        <p>
          If you&apos;d like to report a bug or provide a suggestion, use any of
          the following methods to reach out to the development team:
        </p>
        <Accordion>
          <Accordion.Item label="Submit a form.">
            <p>
              We have a Google form for users to submit issues or suggestions.{" "}
              <Anchor href="/issues/form">
                Click here to access the form.
              </Anchor>
            </p>
          </Accordion.Item>
          <Accordion.Item label="Create a Github issue.">
            <p>
              <Anchor href="https://github.com/enstars/makotools/issues">
                Use our Github repository
              </Anchor>{" "}
              to submit an issue or suggestion. Be sure to provide a detailed
              description on what the issue/suggestion is and label the issue
              accordingly.
            </p>
          </Accordion.Item>
          <Accordion.Item label="Email us.">
            <p>
              <Anchor href="mailto:makotools@ensemble.moe?subject=Issue Report">
                Send us an email
              </Anchor>{" "}
              to let us know about an issue or suggestion. Be sure to provide a
              detailed description on what the issue/suggestion is.
            </p>
          </Accordion.Item>
        </Accordion>
      </TypographyStylesProvider>
    </>
  );
}

export default Page;

Page.getLayout = function getLayout(page, pageProps) {
  return <Layout pageProps={pageProps}>{page}</Layout>;
};
