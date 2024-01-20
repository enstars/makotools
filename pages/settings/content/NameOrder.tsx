import { Text } from "@mantine/core";
import { forwardRef } from "react";
import useTranslation from "next-translate/useTranslation";

import SelectSetting from "../shared/SelectSetting";

const nameOrderItem = forwardRef<HTMLDivElement>(function SelectItem(
  { label, example, ...others }: { label: string; example: string },
  ref
) {
  return (
    <div ref={ref} {...others}>
      <Text size="sm">{label}</Text>
      <Text size="xs" color="dimmed">
        {example}
      </Text>
    </div>
  );
});

function NameOrder() {
  const { t } = useTranslation("settings");
  const nameOrderOptions = [
    {
      value: "firstlast",
      label: t("content.firstLast"),
      example: t("content.firstLastExample"),
    },
    {
      value: "lastfirst",
      label: t("content.lastFirst"),
      example: t("content.lastFirstExample"),
    },
  ];

  return (
    <SelectSetting
      dataKey="setting__name_order"
      label={t("content.nameOrderLabel")}
      data={nameOrderOptions}
      description={t("content.nameOrderDesc")}
      placeholder={nameOrderOptions[0].label + " (Default)"}
      itemComponent={nameOrderItem}
    />
  );
}

export default NameOrder;
