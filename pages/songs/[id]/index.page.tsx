import {
  Box,
  DefaultMantineColor,
  Group,
  Paper,
  Stack,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconMusic } from "@tabler/icons-react";
import { getLayout } from "components/Layout";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { Song } from "types/game";
import { QuerySuccess } from "types/makotools";

function Page({ songQuery }: { songQuery: QuerySuccess<Song> }) {
  const theme = useMantineTheme();
  const { data: song } = songQuery;
  console.log({ song });

  const colors: Array<DefaultMantineColor> = [
    "dark",
    "red",
    "blue",
    "green",
    "yellow",
  ];

  return (
    <Box mt={24}>
      <Group noWrap id="header" spacing="xl" align="start">
        <Paper
          sx={{
            aspectRatio: "1",
            flexBasis: "12vw",
            height: "auto",
            boxShadow: `12px 12px 0px ${
              theme.colors[colors[song.color ?? 1]][4]
            }`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconMusic size={48} />
        </Paper>
        <Stack>
          <Title order={1}>{song.name}</Title>
        </Stack>
      </Group>
    </Box>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ locale, params }) => {
    if (!params?.id || Array.isArray(params?.id)) return { notFound: true };
    console.log({ id: params.id });

    const songs = await getLocalizedDataArray<Song>("songs", locale, "id");
    const song = getItemFromLocalizedDataArray(
      songs,
      parseInt(params.id),
      "id"
    );

    if (song.status === "error") return { notFound: true };

    return {
      props: {
        songQuery: song,
      },
    };
  }
);

Page.getLayout = getLayout({});
export default Page;
