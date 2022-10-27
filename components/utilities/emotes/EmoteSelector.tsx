import { ReactElement, useState } from "react";
import { Popover, ActionIcon, Group, PopoverProps } from "@mantine/core";

import emotes from "../../../services/makotools/emotes";
import { Emote as EmoteType } from "../../../types/makotools";

import Emote from "./Emote";

function EmoteSelector({
  target,
  callback,
  disabled,
  ...props
}: {
  target: (e: () => void) => ReactElement;
  callback: (e: EmoteType) => any;
  disabled: boolean;
} & PopoverProps) {
  const [opened, setOpened] = useState(false);

  const onClickEmote = (e: EmoteType) => {
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
      // target={}
      width={226}
      position="bottom-start"
      withArrow
      styles={(theme) => ({ dropdown: { padding: theme.spacing.xs / 2 } })}
      {...props}
    >
      <Popover.Target>
        {target(() => {
          setOpened((o) => !o);
        })}
      </Popover.Target>
      <Popover.Dropdown>
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
      </Popover.Dropdown>
    </Popover>
  );
}

export default EmoteSelector;
