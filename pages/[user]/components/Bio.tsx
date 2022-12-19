import { Input, Tabs, Textarea, Text } from "@mantine/core";
import { IconPencil, IconTextCaption } from "@tabler/icons";
import { Dispatch, SetStateAction, useState } from "react";

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
  const user = useUser();
  const [opened, setOpened] = useState<boolean>(false);
  if (!user.loggedIn) return null;

  return (
    <>
      <BioHelpModal opened={opened} openFunction={setOpened} />

      <Input.Wrapper label="Bio">
        <Input.Description>
          You can use markdown in your bio (GFM){" "}
          <Text
            component="span"
            onClick={() => setOpened(true)}
            sx={(theme) => ({
              color: theme.colors.indigo[5],
              "&:hover": { cursor: "pointer" },
            })}
          >
            Need help?
          </Text>
        </Input.Description>
        <Tabs variant="pills" defaultValue="edit" mt="xs">
          {!user.db?.admin?.disableTextFields && (
            <Tabs.List>
              <Tabs.Tab value="edit" icon={<IconPencil size={14} />}>
                Edit
              </Tabs.Tab>
              <Tabs.Tab value="preview" icon={<IconTextCaption size={14} />}>
                Preview
              </Tabs.Tab>
            </Tabs.List>
          )}

          <Tabs.Panel value="edit" pt="xs">
            <TextSetting
              label=""
              dataKey="profile__bio"
              placeholder="Say something about yourself!"
              charLimit={3640}
              Component={Textarea}
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
