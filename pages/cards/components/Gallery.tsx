import { Accordion, AspectRatio, Group, Title } from "@mantine/core";

import Picture from "components/core/Picture";

function PicturePair({
  card,
  url,
  width,
  ratio,
  ...props
}: {
  card: GameCard;
  url: string;
  width: number;
  ratio: number;
} & any) {
  return (
    <Group position="center" spacing="xs">
      {["normal", "evolution"].map((type) => (
        <AspectRatio
          ratio={ratio}
          key={type}
          sx={{
            "&&&&&": {
              minHeight: 10,
              flexGrow: 1,
              flexShrink: 0,
              flexBasis: 150,
              maxWidth: width,
            },
          }}
        >
          <Picture
            radius="sm"
            alt={card.title[0]}
            withPlaceholder
            srcB2={`${url}${card.id}_${type}.png`}
            action="view"
            {...props}
          />
        </AspectRatio>
      ))}
    </Group>
  );
}

function Gallery({ card }: { card: GameCard }) {
  return (
    <>
      <Group
        mt="lg"
        mb="sm"
        sx={(theme) => ({ justifyContent: "space-between" })}
      >
        <Title order={2} sx={{ flexGrow: 1 }}>
          Gallery
        </Title>
      </Group>
      <Accordion defaultValue={["cgs", "renders"]} variant="filled" multiple>
        <Accordion.Item value="cgs">
          <Accordion.Control>Full CGs</Accordion.Control>
          <Accordion.Panel>
            <PicturePair
              card={card}
              url="assets/card_still_full1_"
              width={250}
              ratio={13 / 6}
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="renders">
          <Accordion.Control>Transparent Renders</Accordion.Control>
          <Accordion.Panel>
            <PicturePair
              card={card}
              url="assets/card_full1_"
              width={205}
              ratio={71 / 40}
              transparent
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="frameless">
          <Accordion.Control>Card</Accordion.Control>
          <Accordion.Panel>
            <PicturePair
              card={card}
              url="assets/card_rectangle4_"
              width={150}
              ratio={4 / 5}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

export default Gallery;
