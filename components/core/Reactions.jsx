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
import emotes from "../../services/emotes";
import { useFirebaseUser } from "../../services/firebase/user";
import Image from "next/image";
import EmoteSelector from "./EmoteSelector";
import Emote from "./Emote";
import { IconChevronDown, IconChevronUp, IconMoodSmile } from "@tabler/icons";
import { Collapse } from "react-collapse";

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
  const [reactions, setReactions] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  useEffect(() => {
    fetchReactions();
  }, [asPath]);
  const { firebaseUser } = useFirebaseUser();

  const currentPageId = asPath.replace(/\//g, "_");
  // const currentPageId = 1;
  const addReaction = (id) => {
    fetch(
      `https://backend-stars.ensemble.moe/reactions.php?page_id=${currentPageId}&content=${id}&name=${firebaseUser.user.id}`,
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
      .then((data) => {
        console.log("Request complete! response:", data);
        // return data;
        setReactions(
          data.map((r) => {
            const emote = emotes.find((e) => e.id === r.content);
            if (emote) return { emote, alt: emote.name, id: r.submit_date };
          })
        );
      })
      .catch((e) => {
        console.error(e);
        // return null;
      });
  };

  // if (!firebaseUser.loggedIn) return null;

  return (
    <Paper my="sm" withBorder p={3} radius="md">
      <Group spacing="xs" sx={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
        <Tooltip
          label={<Text size="xs">Sign in to react!</Text>}
          disabled={firebaseUser.loggedIn}
        >
          <EmoteSelector
            target={(onClick) => {
              return (
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
              );
            }}
            callback={(emote) => {
              console.log(emote);
              addReaction(emote.id);
            }}
            disabled={!firebaseUser.loggedIn}
          />
        </Tooltip>
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
                    maxHeight: collapsed ? 24 : null,
                    // marginRight: collapsed ? -30 : 0,
                  }}
                >
                  {reactions?.map((r) => (
                    <Emote key={r.id} emote={r.emote} />
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
