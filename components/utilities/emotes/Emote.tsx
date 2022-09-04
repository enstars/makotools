import { MantineSize, Text, Tooltip } from "@mantine/core";
import Image from "next/image";

import { Emote } from "../../../types/makotools";

const EMOTE_SIZE = 24;

function Emote({ emote, size }: { emote: Emote; size: number | MantineSize }) {
  //   console.log(emote);
  if (!emote?.emote?.src) return null;
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
    >
      <Image
        src={emote.emote}
        height={size || EMOTE_SIZE}
        width={size || EMOTE_SIZE}
        alt={emote?.name}
      />
    </Tooltip>
  );
}

export default Emote;
