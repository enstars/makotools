import { MantineProvider, Text, Tooltip } from "@mantine/core";
import Image from "next/image";

const EMOTE_SIZE = 24;

function Emote({ emote, size }) {
  //   console.log(emote);
  if (!emote?.emote?.src) return null;
  return (
    <Tooltip
      gutter={2}
      transition="pop"
      styles={(theme) => ({
        body: {
          padding: "2px 5px",
        },
        root: {
          display: "flex",
        },
      })}
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
