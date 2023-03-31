import { Input, Tabs, Textarea, Text } from "@mantine/core";
import { IconPencil, IconTextCaption } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

import TextSetting from "./TextSetting";
import BioHelpModal from "./BioHelpModal";

import BioDisplay from "components/sections/BioDisplay";
import useUser from "services/firebase/user";

function Name({
  externalSetter,
  profileState,
}: {
  externalSetter: Dispatch<SetStateAction<any>>;
  profileState: any;
}) {
  const { t } = useTranslation("user");
  const user = useUser();
  const [opened, setOpened] = useState<boolean>(false);
  if (!user.loggedIn) return null;

  return (
    <>
      <BioHelpModal opened={opened} openFunction={setOpened} />

      <Input.Wrapper>
        <Input.Description>
          <Trans
            i18nKey="user:markdown.link"
            components={[
              <Text
                key="link"
                component="span"
                onClick={() => setOpened(true)}
                sx={(theme) => ({
                  color: theme.colors[theme.primaryColor][5],
                  "&:hover": { cursor: "pointer" },
                })}
              />,
            ]}
          />
        </Input.Description>
        <Tabs variant="outline" defaultValue="edit" mt="xs">
          {!user.db?.admin?.disableTextFields && (
            <Tabs.List>
              <Tabs.Tab value="edit" icon={<IconPencil size={14} />}>
                {t("edit")}
              </Tabs.Tab>
              <Tabs.Tab value="preview" icon={<IconTextCaption size={14} />}>
                {t("preview")}
              </Tabs.Tab>
            </Tabs.List>
          )}

          <Tabs.Panel value="edit" pt="xs">
            <TextSetting
              label=""
              dataKey="profile__bio"
              placeholder={t("bioPlaceholder")}
              charLimit={3640}
              Component={Textarea}
              autosize={true}
              minRows={2}
              maxRows={8}
              externalSetter={externalSetter}
              profileState={profileState}
              showCharCount
            />
          </Tabs.Panel>

          <Tabs.Panel value="preview" pt="xs">
            <BioDisplay rawBio={profileState.profile__bio} />
          </Tabs.Panel>
        </Tabs>
      </Input.Wrapper>
    </>
  );
}

export default Name;
