import { Anchor, Box, Group, Stack, Text, Title } from "@mantine/core";
import useTranslation from "next-translate/useTranslation";
import { IconAward, IconDiamond } from "@tabler/icons-react";

import Picture from "components/core/Picture";
import SectionTitle from "pages/events/components/SectionTitle";
import { Event, GameCard, Scout } from "types/game";

export default function HowToObtain({
  card,
  obtainCampaign,
}: {
  card: GameCard;
  obtainCampaign: Event | Scout;
}) {
  const { t } = useTranslation("cards__card");
  const obtainCampaignType = card.obtain.type;
  return (
    <Box>
      <SectionTitle
        title={
          obtainCampaignType === "event"
            ? t("obtain.associatedEvent")
            : t("obtain.associatedScout")
        }
        id={"associated"}
        Icon={obtainCampaignType === "event" ? IconAward : IconDiamond}
      />

      <Group align="flex-start">
        <Box sx={{ "&&&": { position: "relative", flex: "1 2 45%" } }}>
          <Picture
            radius="sm"
            sx={{ height: 200 }}
            srcB2={`assets/card_still_full1_${obtainCampaign.banner_id}_evolution.png`}
            alt={obtainCampaign?.name[0]}
          />
        </Box>
        <Box sx={{ "&&&": { flex: "1 1 50%", minWidth: 240 } }}>
          <Stack spacing="xs">
            <Title order={3}>
              {(obtainCampaign.name && obtainCampaign.name[0]) ||
                obtainCampaign.name[1]}
            </Title>
            <Text color="dimmed" size="sm">
              {obtainCampaign.intro_lines && obtainCampaign.intro_lines[0]}
            </Text>
            <Anchor
              href={
                obtainCampaignType === "event"
                  ? `/events/${obtainCampaign.event_id}`
                  : `/scouts/${obtainCampaign.event_id}`
              }
            >
              {t("obtain.moreDetails")}
            </Anchor>
          </Stack>
        </Box>
      </Group>
    </Box>
  );
}

// event    shuffle
// event    tour
// event    unit

// gacha    anniv
// gacha    event
// gacha    feature
// gacha    initial

// initial
// campaign    anniv
// special
