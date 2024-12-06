import { Accordion, AspectRatio, Group, Title } from "@mantine/core";
import useTranslation from "next-translate/useTranslation";

import Picture from "components/core/Picture";
import { GameCard } from "types/game";

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
  const { t } = useTranslation("cards__card");

  return (
    <>
      <Group
        mt="lg"
        mb="sm"
        sx={(theme) => ({ justifyContent: "space-between" })}
      >
        <Title order={2} sx={{ flexGrow: 1 }}>
          {t("gallery.heading")}
        </Title>
      </Group>
      <Accordion defaultValue={["cgs", "renders"]} variant="filled" multiple>
        {card.rarity >= 4 && (
          <Accordion.Item value="cgs">
            <Accordion.Control>{t("gallery.fullCgs")}</Accordion.Control>
            <Accordion.Panel>
              <PicturePair
                card={card}
                url="assets/card_still_full1_"
                width={250}
                ratio={13 / 6}
              />
            </Accordion.Panel>
          </Accordion.Item>
        )}

        <Accordion.Item value="renders">
          <Accordion.Control>{t("gallery.renders")}</Accordion.Control>
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
          <Accordion.Control>{t("gallery.card")}</Accordion.Control>
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
