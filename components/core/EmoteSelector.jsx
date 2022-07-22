import { useState } from "react";
import { Popover, Text, Button, Image, ActionIcon, Group } from "@mantine/core";
import emotes from "../../services/emotes";
import Emote from "./Emote";

function EmoteSelector({ target, callback, ...props }) {
  const [opened, setOpened] = useState(false);

  const onClickEmote = (e) => {
    setOpened(false);
    try {
      callback(e);
    } catch {
      // no callback - do nothing
    }
  };
  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      //   target={target}
      target={target(() => {
        setOpened((o) => !o);
      })}
      width={226}
      position="bottom-start"
      withArrow
      styles={(theme) => ({ inner: { padding: theme.spacing.xs / 2 } })}
      {...props}
    >
      <Group spacing={2}>
        {emotes.map((e) => (
          <ActionIcon
            key={e.name}
            size="lg"
            p={2}
            onClick={() => {
              onClickEmote(e);
            }}
          >
            <Emote emote={e} size={32} />
          </ActionIcon>
        ))}
      </Group>
    </Popover>
  );
}

export default EmoteSelector;
