import { Box, Button, Group, Text, TextInput } from "@mantine/core";

import useUser from "../../../services/firebase/user";

import { sendVerificationEmail } from "services/firebase/firestore";

function Email() {
  const user = useUser();
  return (
    <Box>
      <TextInput
        label="Email"
        value={(user.loggedIn && user.user.email) || " "}
        readOnly
      />
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
}

export default Email;
