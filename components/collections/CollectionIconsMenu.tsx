import { AspectRatio, Menu, Text } from "@mantine/core";
import { ReactNode } from "react";

import { COLLECTION_ICONS } from "./collectionsIcons";

import ResponsiveGrid from "components/core/ResponsiveGrid";

export default function CollectionIconsMenu({
  target,
  onChange,
}: {
  target: ReactNode;
  onChange: (icon: number) => any;
}) {
  return (
    <Menu position="top" withinPortal={true} width={200}>
      <Menu.Target>{target}</Menu.Target>
      <Menu.Dropdown>
        <Menu.Label sx={{ textAlign: "center" }}>
          Choose a collection icon
        </Menu.Label>
        <ResponsiveGrid width={35} sx={{ gap: 6 }}>
          {COLLECTION_ICONS.map((icon, i) => (
            <Menu.Item
              key={icon.name}
              onClick={() => {
                onChange(i);
              }}
              p={0}
              sx={{
                width: "auto",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <AspectRatio
                ratio={1}
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Text color={icon.color}>
                  <icon.component {...icon.props} />
                </Text>
              </AspectRatio>
            </Menu.Item>
          ))}
        </ResponsiveGrid>
      </Menu.Dropdown>
    </Menu>
  );
}
