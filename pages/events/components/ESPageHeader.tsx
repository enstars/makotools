import { Group, Box, Space, Badge, Text } from "@mantine/core";
import {
  IconDiamond,
  IconArrowsShuffle2,
  IconBus,
  IconComet,
} from "@tabler/icons";
import dayjs from "dayjs";

import IconEnstars from "components/core/IconEnstars";
import Picture from "components/core/Picture";
import { GameEvent, GameUnit, ScoutEvent } from "types/game";

function ESPageHeader({
  content,
  units,
}: {
  content: GameEvent | ScoutEvent;
  units?: GameUnit[];
}) {
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
                Start ({dayjs(content.start_date).format("z")})
              </Text>
              <Text size="lg" weight={500}>
                {dayjs(content.start_date).format("lll")}
              </Text>
            </Box>
            <Box sx={{ flex: "1 1 0", minWidth: 200 }}>
              <Text size="sm" color="dimmed" weight={700}>
                End ({dayjs(content.end_date).format("z")})
              </Text>
              <Text size="lg" weight={500}>
                {dayjs(content.end_date).format("lll")}
              </Text>
            </Box>
          </Group>
          <Space h="md" />
          <Group noWrap>
            {dayjs(content.end_date).isBefore(dayjs()) ? (
              <Badge color="gray">Past</Badge>
            ) : dayjs().isBetween(
                dayjs(content.start_date),
                dayjs(content.end_date)
              ) ? (
              <Badge color="yellow">Ongoing</Badge>
            ) : (
              <Badge color="lime">Upcoming</Badge>
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
                  ? "blue"
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
              {content.type}
            </Badge>
          </Group>
        </Box>
      </Group>
    </>
  );
}

export default ESPageHeader;
