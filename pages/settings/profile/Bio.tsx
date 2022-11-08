import { Alert, Input, Tabs, Textarea, Text } from "@mantine/core";
import { IconAlertCircle, IconPencil, IconTextCaption } from "@tabler/icons";
import Link from "next/link";

import TextSetting from "../shared/TextSetting";
import useUser from "../../../services/firebase/user";
import BioDisplay from "../../../components/sections/BioDisplay";

function Name() {
  const user = useUser();
  if (!user.loggedIn) return null;

  return (
    <>
      <Input.Wrapper
        label="Bio"
        description="You can use markdown in your bio (GFM)"
      >
        {user.db.admin.disableTextFields && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            sx={{ marginTop: "2vh" }}
          >
            You&apos;ve been restricted from editing your profile. You can
            submit an appeal through our{" "}
            <Text component={Link} href="/issues">
              issues
            </Text>{" "}
            page.
          </Alert>
        )}
        <Tabs variant="pills" defaultValue="edit" mt="xs">
          {!user.db.admin.disableTextFields && (
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
              maxRows={50}
              showCharCount
            />
          </Tabs.Panel>

          <Tabs.Panel value="preview" pt="xs">
            <BioDisplay rawBio={user.db?.profile__bio} />
          </Tabs.Panel>
        </Tabs>
      </Input.Wrapper>
    </>
  );
}

export default Name;
