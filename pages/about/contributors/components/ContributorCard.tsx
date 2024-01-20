import { Box, Card, Text, Title } from "@mantine/core";
import Link from "next/link";

function makeLanguageArray(languagesString: string) {
  const languageArray = languagesString.split(", ");
  console.log("language array:", languageArray);
  return languageArray;
}

function ContributorLanguages({
  contributor,
  lang,
}: {
  contributor: any;
  lang: string;
}) {
  return <div>TL:{lang}</div>;
}

function ContributorCard({ contributor }: { contributor: any }) {
  return (
    <>
      <Card
        shadow="sm"
        radius="md"
        withBorder
        key={contributor.name + contributor.makotools}
      >
        <Card.Section p="md">
          <Box sx={{ width: 100, height: 100 }} />
          <Title order={3}>{contributor.name}</Title>
          {contributor.makotools && (
            <Text
              component={Link}
              href={`/${contributor.makotools}`}
              color="dimmed"
            >
              {contributor.makotools}
            </Text>
          )}
        </Card.Section>
      </Card>
    </>
  );
}

export default ContributorCard;
