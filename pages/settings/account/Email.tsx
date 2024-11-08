import { Box, Button, Group, Text, TextInput } from "@mantine/core";
import useTranslation from "next-translate/useTranslation";

import useUser from "services/firebase/user";
import { sendVerificationEmail } from "services/firebase/firestore";

function Email() {
  const { t } = useTranslation("settings");
  const { user } = useUser();
  if (user?.email !== null) {
    return (
      <Box>
        <TextInput
          label={t("account.emailLabel")}
          value={user?.email ?? " "}
          readOnly
        />
        {user?.emailVerified ? (
          <Text mt="xs" size="sm" color="dimmed">
            {t("account.emailVerified")}
          </Text>
        ) : (
          <Group mt="xs" position="apart">
            <Text size="sm" color="dimmed">
              {t("account.emailNotVerified")}
            </Text>
            <Button
              compact
              variant="subtle"
              onClick={() => {
                if (user?.id && !user.emailVerified) {
                  sendVerificationEmail();
                }
              }}
            >
              {t("account.resendVerificationEmail")}
            </Button>
          </Group>
        )}
      </Box>
    );
  } else {
    return (
      <Box>
        <TextInput
          label={t("account.emailLabel")}
          value={""}
          placeholder={t("account.twitterSignin")}
          readOnly
        />
        {/* <Input.Wrapper label="Email">
          <Button
            onClick={async () => {
              const setEmailPassword = await bindEmailForTwitterUser();
              console.log(setEmailPassword);
            }}
          >
            Set up an email/password for this account
          </Button>
        </Input.Wrapper> */}
      </Box>
    );
  }
}

export default Email;
