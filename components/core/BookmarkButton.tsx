import { Anchor, Box, Paper, useMantineTheme } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

import useUser from "services/firebase/user";

function SVGBookmark(props: any) {
  return (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="80"
      viewBox="0 0 24 48"
      fill="none"
      stroke="currentColor"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
      // style="position: absolute; top: -16px;"
      {...props}
    >
      <path d="M18 0v45l-6 -4l-6 4v-45a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" />
    </Box>
  );
}

type BookmarkType = "event" | "scout"; // | "card" | "collection";

export default function BookmarkButton({
  id,
  type,
  mr,
}: {
  id: number;
  type: BookmarkType;
  mr?: number | string;
}) {
  const user = useUser();
  const theme = useMantineTheme();
  const { t } = useTranslation("bookmarks");

  if (!user.loggedIn) {
    return null;
  }

  const userDbProp =
    type === "event" ? "bookmarks__events" : "bookmarks__scouts";

  const isBookmarked = user.db[userDbProp]?.includes(id);

  const addBookmark = (callback?: any) => {
    user.db.set(
      {
        [userDbProp]: arrayUnion(id),
      },
      callback
    );
  };

  const removeBookmark = (callback?: any) => {
    user.db.set(
      {
        [userDbProp]: arrayRemove(id),
      },
      callback
    );
  };

  return (
    <Paper
      top={0}
      sx={{
        zIndex: 999,
        cursor: "pointer",
        width: 40,
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isBookmarked) {
          removeBookmark(() => {
            showNotification({
              message: t("bookmark_removed"),
              color: "red",
            });
          });
        } else {
          addBookmark(() => {
            showNotification({
              title: t("bookmark_added"),
              message: (
                <>
                  <Trans
                    i18nKey="bookmarks:bookmark_added_description"
                    components={[
                      <Anchor
                        component={Link}
                        href={`/bookmarks`}
                        inherit
                        key={0}
                      />,
                    ]}
                  />
                </>
              ),
              color: "teal",
            });
          });
        }
      }}
    >
      <SVGBookmark
        className={isBookmarked ? "bookmarked" : ""}
        sx={{
          position: "absolute",
          top: -48,
          right: mr || 0,
          opacity: 0.5,
          transition: "0.2s ease",
          transform: "translateY(0px)",
          ["&:hover"]: {
            transform: "translateY(4px)",
          },
          ["&.bookmarked"]: {
            top: -24,
            opacity: 1,
            // fill: "currentColor",
            fill: theme.colors[theme.primaryColor][
              theme.colorScheme === "dark" ? 4 : 7
            ],
            stroke:
              theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 4 : 7
              ],
          },
        }}
      />
    </Paper>
  );
}
