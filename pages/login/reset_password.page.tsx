import {
  Alert,
  Anchor,
  Button,
  Container,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "@mantine/form";

import { getLayout } from "components/Layout";
import getServerSideUser from "services/firebase/getServerSideUser";
import { sendPasswordReset } from "services/firebase/firestore";

function Page() {
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
    },
  });

  return (
    <Container pt="lg" style={{ height: "100%", maxWidth: 400 }}>
      <Anchor
        component={Link}
        href="/login"
        id="signin-back-link"
        size="sm"
        color="dimmed"
        mb="sm"
        style={{ display: "block" }}
      >
        Back to Login
      </Anchor>
      {emailSent && (
        <Alert color="green" mb="md" icon={<IconCheck />}>
          A password reset link has been sent to your email address.
        </Alert>
      )}
      <Paper radius="md" p="md" withBorder sx={{ width: "100%" }}>
        <Title order={2} size="lg" mb="sm">
          Forgot password?
        </Title>
        <form
          id="send-password-reset"
          onSubmit={form.onSubmit((values) => {
            sendPasswordReset(form.values.email, setEmailSent);
          })}
        >
          <Stack>
            <TextInput
              label="Email address"
              placeholder="MakoTools account email address"
              required
              {...form.getInputProps("email")}
            />
            <Button type="submit">Send password reset link</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export const getServerSideProps = getServerSideUser(() => {
  return { props: {} };
});
Page.getLayout = getLayout({
  hideSidebar: true,
  hideFooter: true,
  hideHeader: true,
});

export default Page;
