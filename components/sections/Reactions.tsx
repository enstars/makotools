import { useRouter } from "next/router";
import {
  ActionIcon,
  Box,
  Button,
  createStyles,
  Divider,
  Group,
  Paper,
  Spoiler,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IconChevronDown, IconChevronUp, IconMoodSmile } from "@tabler/icons";
import { Collapse } from "react-collapse";

import emotes from "../../services/emotes";
import { useUser } from "../../services/firebase/user";
import EmoteSelector from "../utilities/emotes/EmoteSelector";
import Emote from "../utilities/emotes/Emote";
import { DbReaction, Reaction } from "../../types/makotools";

const useStyles = createStyles((theme) => ({
  wrapper: {
    // transition: "height 0.2s",
    transition: theme.other.transition,
    overflow: "hidden",
  },
  content: {},
}));

function Reactions() {
  const { classes } = useStyles();
  const { asPath } = useRouter();
  console.log(asPath);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  useEffect(() => {
    fetchReactions();
  }, [asPath]);
  const user = useUser();

  const currentPageId = asPath.replace(/\//g, "_");
  // const currentPageId = 1;
  const addReaction = (id: string) => {
    if (user.loading || !user.loggedIn) return;
    fetch(
      `https://backend-stars.ensemble.moe/reactions.php?page_id=${currentPageId}&content=${id}&name=${user.user.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: { content: "a", name: "b", parent_id: -1 },
      }
    )
      .then((res) => {
        console.log("Request complete! response:", res);
        fetchReactions();
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const fetchReactions = () => {
    fetch(
      `https://backend-stars.ensemble.moe/reactions.php?page_id=${currentPageId}`
    )
      .then((res) => res.json())
      .then((data: DbReaction[]) => {
        console.log("Request complete! response:", data);
        // return data;
        const reactions = data
          .map((r) => {
            const emote = emotes.find((e) => e.stringId === r.content);
            if (emote) {
              const reaction: Reaction = {
                emote,
                alt: emote.name,
                id: r.submit_date,
              };
              return reaction;
            }
          })
          .filter((e) => typeof e !== "undefined");
        setReactions(reactions as Reaction[]);
      })
      .catch((e) => {
        console.error(e);
        // return null;
      });
  };

  // if (!user.loggedIn) return null;

  return (
    <Paper my="sm" withBorder p={3} radius="md">
      <Group spacing="xs" sx={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
        <EmoteSelector
          target={(onClick) => {
            return (
              <Tooltip
                label={<Text size="xs">Sign in to react!</Text>}
                disabled={!user.loading && user.loggedIn}
              >
                <Button
                  variant="light"
                  size="xs"
                  color="blue"
                  onClick={onClick}
                  leftIcon={<IconMoodSmile size={16} />}
                  px="xs"
                >
                  Reactions
                </Button>
              </Tooltip>
            );
          }}
          callback={(emote) => {
            console.log(emote);
            addReaction(emote.stringId);
          }}
          disabled={user.loading || !user.loggedIn}
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

                // marginRight: collapsed ? -30 : 0,
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
                    // marginRight: collapsed ? -30 : 0,
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
