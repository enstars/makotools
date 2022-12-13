import { Box, Button, Group, Text, TextInput } from "@mantine/core";

import useUser from "services/firebase/user";
import { sendVerificationEmail } from "services/firebase/firestore";
import { UserLoggedIn } from "types/makotools";

function Email() {
  const user = useUser() as UserLoggedIn;
  console.log(user);
  if (user.user.email !== null) {
    return (
      <Box>
        <TextInput label="Email" value={user.user.email || " "} readOnly />
        {user.loggedIn && user.user.emailVerified ? (
          <Text mt="xs" size="sm" color="dimmed">
            Your email has been verified!
          </Text>
        ) : (
          <Group mt="xs" position="apart">
            <Text size="sm" color="dimmed">
              Your email has not been verified.
            </Text>
            <Button
              compact
              variant="subtle"
              onClick={() => {
                if (user.loggedIn && !user.user.emailVerified) {
                  sendVerificationEmail();
                }
              }}
            >
              Resend verification email
            </Button>
          </Group>
        )}
      </Box>
    );
  } else {
    return (
      <Box>
        <TextInput
          label="Email"
          value={""}
          placeholder="Signed in with Twitter"
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
