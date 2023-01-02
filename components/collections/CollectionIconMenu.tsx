import { ActionIcon, Menu, Text } from "@mantine/core";
import { IconChevronUp } from "@tabler/icons";

import { CollectionIcons } from "./CollectionIcons";

import { CardCollection } from "types/makotools";

export default function CollectionIconMenu({
  value,
  onChange,
}: {
  value: CardCollection["icon"];
  onChange: (icon: number) => any;
}) {
  const currentIcon = CollectionIcons[value || 0];

  return (
    <Menu position="top">
      <Menu.Target>
        <ActionIcon
          sx={{
            display: "flex",
            flexFlow: "row no-wrap",
            alignItems: "center",
            width: "auto",
            height: "auto",
            minHeight: 0,
          }}
        >
          <Text color={currentIcon.color}>
            <currentIcon.component {...currentIcon.props} />
          </Text>
          <IconChevronUp size={20} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown sx={{ width: "auto", maxWidth: "260px" }}>
        <Menu.Label sx={{ textAlign: "center" }}>
          Choose a collection icon
        </Menu.Label>
        {CollectionIcons.map((icon, i) => (
          <Menu.Item
            key={icon.name}
            component="button"
            onClick={() => {
              onChange(i);
            }}
            sx={{ width: "auto", display: "inline" }}
          >
            <Text color={icon.color}>
              <icon.component {...icon.props} />
            </Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
