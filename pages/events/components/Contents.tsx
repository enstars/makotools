import { Accordion, Title, List, Text } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";

interface ContentItem {
  name: string;
  id: string;
  icon: ReactNode;
}

function Contents({ items }: { items: ContentItem[] }) {
  return (
    <Accordion
      variant="contained"
      defaultValue="contents"
      sx={{
        ["@media (min-width: 900px)"]: {
          width: "50%",
        },
      }}
    >
      <Accordion.Item value="contents">
        <Accordion.Control>
          <Title order={4}>Contents</Title>
        </Accordion.Control>
        <Accordion.Panel>
          <List size="md" spacing="sm" center>
            {items.map((item: ContentItem) => (
              <List.Item key={item.id} icon={item.icon}>
                <Text size="md" component={Link} href={item.id}>
                  {item.name}
                </Text>
              </List.Item>
            ))}
          </List>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export default Contents;
