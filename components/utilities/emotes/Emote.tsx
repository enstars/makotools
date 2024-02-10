import { MantineSize, Text, Tooltip, useMantineTheme } from "@mantine/core";
import Image from "next/image";

import { Emote } from "types/makotools";

const EMOTE_SIZE = 24;

function Emote({ emote, size }: { emote: Emote; size: number | MantineSize }) {
  const theme = useMantineTheme();
  if (!emote?.emote?.src) return null;
  const numberSize =
    typeof size === "undefined"
      ? EMOTE_SIZE
      : typeof size === "number"
      ? size
      : theme.fontSizes[size];
  return (
    <Tooltip
      offset={2}
      transition="pop"
      styles={{
        tooltip: {
          padding: "2px 5px",
          display: "flex",
        },
      }}
      label={
        <Text size="xs" weight={500}>
          {emote.name.replace(/ /g, "")}
        </Text>
      }
      withinPortal
    >
      <Image
        src={emote.emote}
        height={numberSize}
        width={numberSize}
        alt={emote?.name}
      />
    </Tooltip>
  );
}

export default Emote;
