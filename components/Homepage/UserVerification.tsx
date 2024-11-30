import { Alert, Anchor, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

import { sendVerificationEmail } from "services/firebase/firestore";
import useUser from "services/firebase/user";

function UserVerification() {
  const { user } = useUser();

  return (
    <>
      {user?.email && !user.emailVerified && (
        <Alert
          sx={{ width: "100%" }}
          py="xs"
          px="md"
          my={-4}
          icon={<IconInfoCircle size={18} />}
        >
          <Text size="sm">
            Your email has not been verified.{" "}
            <Anchor
              onClick={() => {
                sendVerificationEmail();
              }}
            >
              Resend verification email
            </Anchor>
          </Text>
        </Alert>
      )}
    </>
  );
}

export default UserVerification;
