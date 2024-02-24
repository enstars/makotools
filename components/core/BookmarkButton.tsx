import { Paper, Stack, Text, useMantineTheme } from "@mantine/core";
import { UseListStateHandlers } from "@mantine/hooks";
import { IconBookmark } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";

import useUser from "services/firebase/user";

export default function BookmarkButton({
  id,
  bookmarkList,
  listHandler,
}: {
  id: number;
  bookmarkList: number[];
  listHandler: UseListStateHandlers<number>;
}) {
  const user = useUser();
  const theme = useMantineTheme();
  const { t } = useTranslation("events__event");

  return (
    <Paper
      pos="fixed"
      top={0}
      right="20%"
      shadow="lg"
      px={12}
      pb={4}
      pt={40}
      sx={{
        zIndex: 999,
        cursor: "pointer",
      }}
      onClick={() => {
        bookmarkList.includes(id)
          ? listHandler.remove(bookmarkList.indexOf(id))
          : listHandler.append(id);
      }}
    >
      <Stack align="center">
        <IconBookmark
          size={40}
          fill={
            bookmarkList.includes(id)
              ? theme.colors[theme.primaryColor][4]
              : "none"
          }
          strokeWidth={bookmarkList.includes(id) ? 0 : 1}
        />
        <Text>
          {user.loggedIn
            ? bookmarkList.includes(id)
              ? t("events:event.removeBookmark")
              : t("events:event.addBookmark")
            : t("loginBookmark")}
        </Text>
      </Stack>
    </Paper>
  );
}
