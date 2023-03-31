import { Group, Box, Space, Badge, Text } from "@mantine/core";
import {
  IconDiamond,
  IconArrowsShuffle2,
  IconBus,
  IconComet,
  IconRotateClockwise2,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";

import IconEnstars from "components/core/IconEnstars";
import Picture from "components/core/Picture";
import { Event, GameUnit, Scout } from "types/game";

function ESPageHeader({
  content,
  units,
}: {
  content: Event | Scout;
  units?: GameUnit[];
}) {
  const { t } = useTranslation("events__event");
  return (
    <>
      <Group position="apart" align="flex-start">
        <Box sx={{ position: "relative", flex: "2 1 50%" }}>
          <Picture
            alt={content.name[0]}
            srcB2={`assets/card_still_full1_${content.banner_id}_evolution.png`}
            sx={{
              height: 180,
              picture: { position: "relative", img: { marginTop: "2vh" } },
            }}
            radius="md"
            action="view"
          />
        </Box>
        <Box sx={{ flex: "2 1 50%" }}>
          <Group>
            <Box sx={{ flex: "1 1 0", minWidth: 200 }}>
              <Text size="sm" color="dimmed" weight={700}>
                {t("events:event.start")} ({dayjs(content.start.en).format("z")}
                )
              </Text>
              <Text size="lg" weight={500}>
                {dayjs(content.start.en).format("lll")}
              </Text>
            </Box>
            <Box sx={{ flex: "1 1 0", minWidth: 200 }}>
              <Text size="sm" color="dimmed" weight={700}>
                {t("events:event.end")} ({dayjs(content.end.en).format("z")})
              </Text>
              <Text size="lg" weight={500}>
                {dayjs(content.end.en).format("lll")}
              </Text>
            </Box>
          </Group>
          <Space h="md" />
          <Group noWrap>
            {dayjs(content.end.en).isBefore(dayjs()) ? (
              <Badge color="gray">{t("past")}</Badge>
            ) : dayjs().isBetween(
                dayjs(content.start.en),
                dayjs(content.end.en)
              ) ? (
              <Badge color="yellow">{t("ongoing")}</Badge>
            ) : (
              <Badge color="lime">{t("upcoming")}</Badge>
            )}
            {units &&
              units.map((unit) => (
                <Badge
                  key={unit.id}
                  color={unit.image_color}
                  leftSection={<IconEnstars unit={unit.id} size={10} />}
                  sx={{
                    background: unit.image_color,
                  }}
                  variant="filled"
                >
                  {unit.name[0]}
                </Badge>
              ))}
            <Badge
              variant="filled"
              color={
                content.type === "song"
                  ? "grape"
                  : content.type === "shuffle"
                  ? "toya_default"
                  : content.type === "tour"
                  ? "teal"
                  : content.type === "scout"
                  ? "purple"
                  : "lime"
              }
              leftSection={
                <Box mt={4}>
                  {content.type === "song" ? (
                    <IconDiamond size={12} strokeWidth={3} />
                  ) : content.type === "shuffle" ? (
                    <IconArrowsShuffle2 size={12} strokeWidth={3} />
                  ) : content.type === "tour" ? (
                    <IconBus size={12} strokeWidth={3} />
                  ) : content.type === "scout" ? (
                    <IconDiamond size={12} strokeWidth={3} />
                  ) : (
                    <IconComet size={12} strokeWidth={3} />
                  )}
                </Box>
              }
            >
              {t(
                `events:${
                  content.type === "feature scout"
                    ? "featureScout"
                    : content.type
                }`
              )}
            </Badge>
            {(content.type === "scout" || content.type === "feature scout") &&
              dayjs().isAfter(dayjs(content.start.en).add(3, "M")) && (
                <Badge
                  leftSection={
                    <Box mt={4}>
                      <IconRotateClockwise2 size={12} strokeWidth={3} />
                    </Box>
                  }
                >
                  {t("diaScout")}
                </Badge>
              )}
          </Group>
        </Box>
      </Group>
    </>
  );
}

export default ESPageHeader;
