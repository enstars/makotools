import { TextInput } from "@mantine/core";
import useTranslation from "next-translate/useTranslation";

function UniqueCode({ uniqueCode }: { uniqueCode: string }) {
  const { t } = useTranslation("settings");

  return (
    <TextInput
      label={t("account.uniqueCodeLabel")}
      value={uniqueCode}
      readOnly
      description={t("account.uniqueCodeDesc")}
    />
  );
}

export default UniqueCode;
