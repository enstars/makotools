import {
  Box,
  Center,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconClock, IconMusic } from "@tabler/icons-react";
import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import getServerSideUser from "services/firebase/getServerSideUser";

function BackgroundGradient() {
  const theme = useMantineTheme();
  return (
    <Box
      id="background-gradient"
      sx={{
        position: "absolute",
        width: "calc(100% + 48px)",
        height: "calc(100% + 32px)",
        top: 0,
        left: 0,
        backgroundImage: `linear-gradient(45deg, ${
          theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 9 : 2]
        }21, transparent )`,
        margin: "-16px -24px",
      }}
    />
  );
}

function Page() {
  const theme = useMantineTheme();
  return (
    <>
      <Paper
        radius="lg"
        shadow="md"
        p="xl"
        mt={8}
        sx={{
          backgroundImage: `linear-gradient(45deg, ${
            theme.colors[theme.primaryColor][
              theme.colorScheme === "dark" ? 9 : 2
            ]
          }${theme.colorScheme === "dark" ? 21 : 55}, transparent )`,
        }}
      >
        <Group noWrap id="page-header" align="center" spacing="xl" p="xl">
          <Paper shadow="sm" p="xl" sx={{ width: "12vw", height: "12vw" }}>
            <Center>
              <IconMusic />
            </Center>
          </Paper>
          <Stack>
            <Title order={1} sx={{ fontSize: "4em" }}>
              Songs
            </Title>
            <Text>#### songs</Text>
          </Stack>
        </Group>
        <Stack p="xl">
          <Group
            align="start"
            sx={{
              borderBottom: `1px solid ${
                theme.colors.dark[theme.colorScheme === "dark" ? 2 : 8]
              }2a`,
            }}
          >
            <Box sx={{ width: "5vw" }}></Box>
            <Text sx={{ flexGrow: 1 }}>Title</Text>
            <Text sx={{ flexBasis: "33%" }}>Album</Text>
            <Text>
              <IconClock size={20} />
            </Text>
          </Group>
        </Stack>
      </Paper>
    </>
  );
}
Page.getLayout = getLayout({ wide: true });

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  return {
    props: {},
  };
});

export default Page;
