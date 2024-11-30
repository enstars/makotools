import { useRouter } from "next/router";
import {
  ActionIcon,
  Box,
  Button,
  createStyles,
  Group,
  Loader,
  Paper,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconMoodSmile,
} from "@tabler/icons-react";
import { Collapse } from "react-collapse";

import EmoteSelector from "../utilities/emotes/EmoteSelector";
import Emote from "../utilities/emotes/Emote";

import { DbReaction, Reaction } from "types/makotools";
import useUser from "services/firebase/user";
import emotes from "services/makotools/emotes";
import { CONSTANTS } from "services/makotools/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reactionQueries } from "services/queries";
import { showNotification } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  wrapper: {
    transition: theme.other.transition,
    overflow: "hidden",
  },
  content: {},
}));

const fetchReactions = async (url: string) => {
  const { data }: { data: DbReaction[] } = await (
    await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

  const reactions = data
    .map(({ attributes }) => {
      const emote = emotes.find((e) => e.stringId === attributes.content);
      if (emote) {
        const reaction: Reaction = {
          emote,
          alt: emote.name,
          id: attributes.createdAt,
        };
        return reaction;
      }
    })
    .filter((e) => typeof e !== "undefined");

  return reactions as Reaction[];
};

function Reactions({ fullButton = true }: { fullButton?: boolean }) {
  const qc = useQueryClient();
  const { classes } = useStyles();
  const { asPath } = useRouter();
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const { user, userDB } = useUser();
  const currentPageId = asPath.replace(/\//g, "_");

  const { data: reactions = [], isPending: areReactionsPending } = useQuery({
    queryKey: reactionQueries.fetchReactions(currentPageId),
    enabled: !!currentPageId,
    queryFn: async () => {
      return await fetchReactions(
        `${CONSTANTS.EXTERNAL_URLS.BACKEND}/api/reactions?filters[page][$eq]=${currentPageId}&sort=createdAt:desc`
      );
    },
  });

  const addReaction = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!user) throw new Error("User is not logged in");
      const token = await user.getIdToken();
      if (!token) throw new Error("Could not get user id token");

      await fetch(`${CONSTANTS.EXTERNAL_URLS.BACKEND}/api/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({
          data: {
            user: user.id,
            type: "emote",
            content: id,
            page: currentPageId,
          },
        }),
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: reactionQueries.fetchReactions(currentPageId),
      });
    },
    onError: (error) => {
      showNotification({
        color: "red",
        message: `Could not add reaction: ${error.message}`,
      });
    },
  });

  const theme = useMantineTheme();

  const reactionsDisabled = !userDB;

  if (areReactionsPending) return <Loader my="sm" variant="dots" />;

  return (
    <Paper my="sm" withBorder p={3} radius="md">
      <Group spacing="xs" sx={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
        <EmoteSelector
          target={(onClick) => {
            return (
              <Tooltip
                label={<Text size="xs">Sign in to react!</Text>}
                disabled={!reactionsDisabled}
              >
                <Box>
                  <Button
                    variant="light"
                    size="xs"
                    color={theme.primaryColor}
                    onClick={onClick}
                    leftIcon={<IconMoodSmile size={16} />}
                    px="xs"
                    disabled={reactionsDisabled}
                    sx={{
                      "& .mantine-Button-leftIcon": {
                        marginRight: fullButton ? 10 : 0,
                      },
                    }}
                  >
                    {fullButton && "Reactions"}
                  </Button>
                </Box>
              </Tooltip>
            );
          }}
          callback={(emote) => {
            addReaction.mutate({ id: emote.stringId });
          }}
          disabled={!!userDB}
        >
          <></>
        </EmoteSelector>
        {reactions.length ? (
          <>
            <Box
              sx={{
                flexGrow: 1,
                overflow: "hidden",
                paddingTop: 2,
                maskImage: collapsed
                  ? "linear-gradient(to left, transparent, black 28px)"
                  : "",
              }}
            >
              <Collapse
                isOpened={true}
                theme={{
                  collapse: classes.wrapper,
                  content: classes.content,
                }}
              >
                <Group
                  spacing="xs"
                  sx={{
                    maxHeight: collapsed ? 24 : undefined,
                  }}
                >
                  {reactions?.map((r: any) => (
                    <Emote key={r.id} emote={r.emote} size={24} />
                  ))}
                </Group>
              </Collapse>
            </Box>

            <ActionIcon
              variant="light"
              onClick={() => {
                setCollapsed((c) => !c);
              }}
            >
              {collapsed ? (
                <IconChevronDown size={16} />
              ) : (
                <IconChevronUp size={16} />
              )}
            </ActionIcon>
          </>
        ) : (
          <Box
            sx={{ alignSelf: "stretch", display: "flex", alignItems: "center" }}
          >
            <Text size="sm" color="dimmed">
              Be the first to add a reaction!
            </Text>
          </Box>
        )}
      </Group>
    </Paper>
  );
}

export default Reactions;
