import { useRouter } from "next/router";
import {
  ActionIcon,
  Box,
  Button,
  createStyles,
  Group,
  Paper,
  Text,
  Tooltip,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { IconChevronDown, IconChevronUp, IconMoodSmile } from "@tabler/icons";
import { Collapse } from "react-collapse";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import emotes from "../../services/makotools/emotes";
import useUser from "../../services/firebase/user";
import EmoteSelector from "../utilities/emotes/EmoteSelector";
import Emote from "../utilities/emotes/Emote";
import { DbReaction, Reaction } from "../../types/makotools";

const useStyles = createStyles((theme) => ({
  wrapper: {
    transition: theme.other.transition,
    overflow: "hidden",
  },
  content: {},
}));

function Reactions() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { classes } = useStyles();
  const { asPath } = useRouter();
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const user = useUser();

  const reactionsDisabled = user.loading || !user.loggedIn;

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha();
    return token;
  }, [executeRecaptcha]);

  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);

  const currentPageId = asPath.replace(/\//g, "_");
  const addReaction = async (id: string) => {
    if (user.loading || !user.loggedIn) return;
    const captcha: any = await handleReCaptchaVerify();
    fetch(
      `https://backend-stars.ensemble.moe/db/reactions.php?page_id=${currentPageId}&content=${id}&name=${user.user.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "g-recaptcha-response": captcha,
        },
      }
    )
      .then((res) => {
        fetchReactions();
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const fetchReactions = async () => {
    const captcha: any = await handleReCaptchaVerify();
    fetch(
      `https://backend-stars.ensemble.moe/db/reactions.php?page_id=${currentPageId}`,
      {
        headers: {
          "g-recaptcha-response": captcha,
        },
      }
    )
      .then((res) => res.json())
      .then((data: DbReaction[]) => {
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
      });
  };

  useEffect(() => {
    fetchReactions();
  }, [asPath, handleReCaptchaVerify]);

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
                    color="blue"
                    onClick={onClick}
                    leftIcon={<IconMoodSmile size={16} />}
                    px="xs"
                    disabled={reactionsDisabled}
                  >
                    Reactions
                  </Button>
                </Box>
              </Tooltip>
            );
          }}
          callback={(emote) => {
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
