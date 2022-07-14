import { useState } from "react";
import {
  appSignInWithGoogle,
  appSignInWithEmailAndPassword,
  appSignUpWithEmailAndPassword,
} from "../../services/firebase/authentication";
// import Button from "../core/Button";
import {
  Alert,
  Center,
  Container,
  Paper,
  Text,
  Button,
  Divider,
  InputWrapper,
  TextInput,
  PasswordInput,
  Group,
  Anchor,
  Checkbox,
  Stack,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import Google from "../../assets/google.svg";
import { IconAlertTriangle, IconArrowLeft, IconBrandFirefox } from "@tabler/icons";
import Link from "next/link";
// import { useUserData } from "../../services/userData";
import { useFirebaseUser } from "../../services/firebase/user";

function Login() {
  const [isRegister, setIsRegister] = useState(false);

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

  // const authUser = useAuth();
  // const { userData } = useUserData();
  const userData = {
    loading: false,
    loggedIn: false,
  };
  const { firebaseUser } = useFirebaseUser();

  return (
    <Container pt="lg" style={{ height: "100%", maxWidth: 400 }}>
      {!userData.loading && userData.loggedIn ? (
        <Text align="center" color="dimmed" size="sm">
          Redirecting you to Ensemble Square
        </Text>
      ) : (
        <>
          <Link href="/" passHref>
            <Anchor
              size="sm"
              color="dimmed"
              mb="sm"
              style={{ display: "block" }}
            >
              Back to Ensemble Square
            </Anchor>
          </Link>
          {
            //TODO: remove alert once google auth for firefox works :kaoruplead:
          }
          <Alert icon={<IconBrandFirefox size={32} />} title="IMPORTANT: Firefox users" color="yellow" variant="outline">
            Sign in with Google is currently unavailable for Firefox. Please sign in with email instead. Sorry for the inconvenience!
          </Alert>
          <Paper radius="md" p="md" withBorder sx={{ width: "100%" }}>
            <LoadingOverlay visible={userData.loading} />
            <Title order={2} size="lg" mb="sm">
              {isRegister ? "Sign up" : "Sign in"}
            </Title>
            <Button
              variant="default"
              leftIcon={<Google />}
              onClick={appSignInWithGoogle}
              style={{ width: "100%" }}
            >
              {isRegister ? "Sign up" : "Sign in"} with Google
            </Button>

            <Divider
              label={`Or ${isRegister ? "sign up" : "sign in"} with email`}
              // labelPosition="left"
              mt="md"
              mb="sm"
            />
            <form
              onSubmit={form.onSubmit((values) => {
                console.log(values);
                if (isRegister) {
                  appSignUpWithEmailAndPassword(
                    form.values.email,
                    form.values.password,
                    { name: form.values.name },
                    (res) => {
                      if (res.status === "error") {
                        console.log(res.error);
                        showNotification({
                          message: res.error.message,
                          color: "red",
                          icon: <IconAlertTriangle size={16} />,
                        });
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
                        console.log(res.error);
                        showNotification({
                          message: res.error.message,
                          color: "red",
                          icon: <IconAlertTriangle size={16} />,
                        });
                      }
                    }
                  );
                }
              })}
            >
              <Stack spacing="xs">
                {isRegister && (
                  <TextInput
                    placeholder="Anzu"
                    label="Name"
                    required
                    {...form.getInputProps("name")}
                  />
                )}
                <TextInput
                  placeholder="anzu@ensemblesquare.com"
                  label="Email"
                  required
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  placeholder="Password"
                  label="Password"
                  required
                  {...form.getInputProps("password")}
                />
                {isRegister && (
                  <Checkbox
                    label="I agree to the Terms of Service"
                    // checked={form.values.terms}
                    // onChange={(event) =>
                    //   form.setFieldValue("terms", event.currentTarget.checked)
                    // }
                    {...form.getInputProps("terms", { type: "checkbox" })}
                  />
                  // <InputWrapper id="terms" {...form.getInputProps("terms")}>
                  // </InputWrapper>
                )}
                <Group
                  // mt="xs"
                  style={{
                    flexWrap: "nowrap",
                    justifyContent: "space-between",
                  }}
                >
                  <Anchor
                    component="button"
                    type="button"
                    color="dimmed"
                    onClick={() => setIsRegister(!isRegister)}
                    size="xs"
                    style={{ maxWidth: "100%" }}
                  >
                    {isRegister
                      ? "Already have an account? Sign in"
                      : "Don't have an account? Sign up"}
                  </Anchor>
                  <Button type="submit">
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
