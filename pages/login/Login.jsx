import { useState } from "react";

import {
  Alert,
  Center,
  Container,
  Paper,
  Text,
  Button,
  Divider,
  Input,
  TextInput,
  PasswordInput,
  Group,
  Anchor,
  Checkbox,
  Stack,
  Title,
  LoadingOverlay,
  Badge,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconBrandFirefox,
  IconBrandGoogle,
  IconBrandTwitter,
} from "@tabler/icons";
import Link from "next/link";

import { AuthAction } from "next-firebase-auth";
import { showNotification } from "@mantine/notifications";

import Google from "../../assets/google.svg";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { useFirebaseUser } from "../../services/firebase/user";
import {
  appSignInWithGoogle,
  appSignInWithEmailAndPassword,
  appSignUpWithEmailAndPassword,
  appSignInWithTwitter,
} from "../../services/firebase/authentication";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [signOnError, setSignOnError] = useState(null);

  function signOnAlertMsg(error) {
    console.log(error);
    const { code } = error;
    let message;
    switch (code) {
      case "wrong-password":
        message = <span>The password is incorrect. Please try again.</span>;
        break;
      case "user-not-found":
        message = (
          <span>
            A user with this email address could not be found. Please try again.
          </span>
        );
        break;
      case "timeout":
        message = (
          <span>
            The operation has timed out. Please try again or{" "}
            <Anchor inherit href="/issues">
              submit an issue
            </Anchor>{" "}
            if the problem is persistent.
          </span>
        );
        break;
      case "too-many-requests":
        message = (
          <span>
            The server has received too many sign on requests. Please wait and
            try again later.
          </span>
        );
        break;
      default:
        message = (
          <span>
            An unknown sign on error has occured. Please try again or{" "}
            <Anchor href="/issues">submit an issue</Anchor> if the problem is
            persistent.
          </span>
        );
        break;
    }

    return message;
  }

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length >= 6 ? null : "Password must be over 6 characters long",
      terms: (val) =>
        !isRegister
          ? null
          : val
          ? null
          : "You must agree to the Terms of Service",
    },
  });

  const { firebaseUser } = useFirebaseUser();

  return (
    <Container
      id="signin-container"
      pt="lg"
      style={{ height: "100%", maxWidth: 400 }}
    >
      {!firebaseUser.loading && firebaseUser.loggedIn ? (
        <Text id="signin-redirect" align="center" color="dimmed" size="sm">
          Redirecting you to MakoTools
        </Text>
      ) : (
        <>
          <Link href="/" passHref>
            <Anchor
              id="signin-back-link"
              size="sm"
              color="dimmed"
              mb="sm"
              style={{ display: "block" }}
            >
              Back to Ensemble Square
            </Anchor>
          </Link>
          {signOnError && (
            <Alert
              className="signin-alert-error"
              icon={<IconAlertTriangle />}
              title={
                signOnError.type === "login"
                  ? "Login Error"
                  : "Registration Error"
              }
              color="red"
              style={{
                marginBottom: 10,
              }}
            >
              {signOnAlertMsg(signOnError)}
            </Alert>
          )}
          <Paper
            id="signin-paper-container"
            radius="md"
            p="md"
            withBorder
            sx={{ width: "100%" }}
          >
            <LoadingOverlay visible={firebaseUser.loading} />
            <Title id="signin-title" order={2} size="lg" mb="sm">
              {isRegister ? "Sign up" : "Sign in"}
            </Title>
            <Stack spacing="xs">
              <Button
                id="signin-google"
                variant="default"
                leftIcon={<IconBrandGoogle size={16} />}
                onClick={appSignInWithGoogle}
                style={{ width: "100%" }}
              >
                {isRegister ? "Sign up" : "Sign in"} with Google
              </Button>
              <Button
                id="signin-twitter"
                variant="default"
                leftIcon={<IconBrandTwitter size={16} />}
                onClick={() => {
                  // appSignInWithTwitter((e) => {
                  //   console.log(e.message, JSON.stringify(e));
                  // });
                  showNotification({
                    title: "Twitter sign-on is coming soon!",
                  });
                }}
                style={{ width: "100%" }}
              >
                {isRegister ? "Sign up" : "Sign in"} with Twitter{" "}
                <Badge ml="xs">Soon</Badge>
              </Button>
            </Stack>

            <Divider
              id="signin-email-divider"
              label={`Or ${isRegister ? "sign up" : "sign in"} with email`}
              mt="md"
              mb="sm"
            />
            <form
              id="signin-form"
              onSubmit={form.onSubmit((values) => {
                setSignOnError(null);
                console.log(values);
                if (isRegister) {
                  appSignUpWithEmailAndPassword(
                    form.values.email,
                    form.values.password,
                    { name: form.values.name },
                    (res) => {
                      if (res.status === "error") {
                        const errorCode = res.error.code.split("/")[1];
                        const errorObj = {
                          type: "registration",
                          code: errorCode,
                        };
                        setSignOnError(errorObj);
                      }
                    }
                  );
                } else {
                  console.log("sign in");
                  appSignInWithEmailAndPassword(
                    form.values.email,
                    form.values.password,
                    (res) => {
                      if (res.status === "error") {
                        const errorCode = res.error.code.split("/")[1];
                        const errorObj = {
                          type: "login",
                          code: errorCode,
                        };
                        setSignOnError(errorObj);
                      }
                    }
                  );
                }
              })}
            >
              <Stack id="signin-form-elements" spacing="xs">
                {isRegister && (
                  <TextInput
                    id="signin-input-name"
                    placeholder="Anzu"
                    label="Name"
                    required
                    {...form.getInputProps("name")}
                  />
                )}
                <TextInput
                  id="siginin-input-email"
                  placeholder="anzu@ensemblesquare.com"
                  label="Email"
                  required
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  id="signin-input-password"
                  placeholder="Password"
                  label="Password"
                  required
                  {...form.getInputProps("password")}
                />
                {isRegister && (
                  <Checkbox
                    id="signin-checkbox-tos"
                    label="I agree to the Terms of Service"
                    {...form.getInputProps("terms", { type: "checkbox" })}
                  />
                )}
                <Group
                  id="signin-form-footer"
                  style={{
                    flexWrap: "nowrap",
                    justifyContent: "space-between",
                  }}
                >
                  <Anchor
                    component="button"
                    type="button"
                    color="dimmed"
                    onClick={() => {
                      setIsRegister(!isRegister);
                      setSignOnError(null);
                    }}
                    size="xs"
                    style={{ maxWidth: "100%" }}
                  >
                    {isRegister
                      ? "Already have an account? Sign in"
                      : "Don't have an account? Sign up"}
                  </Anchor>
                  <Button id="signin-form-button" type="submit">
                    {!isRegister ? "Sign in" : "Sign up"}
                  </Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </>
      )}
    </Container>
  );
}
export default Login;
