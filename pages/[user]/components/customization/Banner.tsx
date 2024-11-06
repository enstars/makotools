import {
  ActionIcon,
  Box,
  Button,
  createStyles,
  Group,
  Input,
  Select,
  SimpleGrid,
  Space,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { IconFlower, IconFlowerOff, IconTrash } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GridContextProvider, GridDropZone, GridItem } from "react-grid-drag";
import useTranslation from "next-translate/useTranslation";

import { EditingProfile } from "./EditProfileModal";

import useUser from "services/firebase/user";
import { GameCard } from "types/game";
import Picture from "components/core/Picture";
import PicturePreload from "components/core/PicturePreload";

const useStyles = createStyles((theme) => ({
  item: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  symbol: {
    fontSize: 30,
    fontWeight: 700,
    width: 60,
  },
}));

function Banner({
  cards,
  externalSetter,
}: {
  cards: GameCard[] | undefined;
  externalSetter: Dispatch<SetStateAction<EditingProfile>>;
}) {
  const theme = useMantineTheme();
  const { t } = useTranslation("user");
  const { user, userDB } = useUser();
  const [acValue, setAcValue] = useState("");

  const [state, handlers] = useListState(
    (user.loggedIn && userDB?.profile__banner) || []
  );
  const [reordering, setReordering] = useState(false);

  const NUM_COLS = 3;
  const ROW_HEIGHT = 110;
  const height = Math.ceil(state.length / NUM_COLS) * ROW_HEIGHT;

  useEffect(() => {
    // get state where value are only numbers
    const filteredState = state.filter((item) => typeof item === "number");

    // update listState if its changed
    if (JSON.stringify(filteredState) !== JSON.stringify(state)) {
      handlers.setState(filteredState);
    }

    // update profile banner if user is logged in and state has changed
    if (
      user.loggedIn &&
      userDB?.profile__banner &&
      JSON.stringify(userDB.profile__banner) !== JSON.stringify(state)
    ) {
      externalSetter((s) => ({
        ...s,
        profile__banner: filteredState,
      }));
    }
  }, [state, user, externalSetter, handlers]);

  if (!cards)
    return (
      <Text color="dimmed" size="sm">
        {t("cardError")}
      </Text>
    );

  return (
    <>
      {state.map((item) => (
        <>
          <PicturePreload
            srcB2={`assets/card_still_full1_${Math.abs(item)}_normal.png`}
          />
          <PicturePreload
            srcB2={`assets/card_still_full1_${Math.abs(item)}_evolution.png`}
          />
        </>
      ))}
      <Input.Wrapper label={t("currentBannerCards")}>
        <Space mb="xs" />
        {reordering ? (
          <Box
            sx={{
              margin: theme.spacing.xs * -0.5,
            }}
          >
            <GridContextProvider
              onChange={(
                sourceId: string,
                sourceIndex: number,
                targetIndex: number,
                targetId: string
              ) => {
                handlers.reorder({ from: sourceIndex, to: targetIndex });
              }}
            >
              <GridDropZone
                id="card-drop-zone"
                boxesPerRow={NUM_COLS}
                rowHeight={ROW_HEIGHT}
                style={{
                  width: "100%",
                  height: height,
                  margin: "auto",
                }}
              >
                {state.map((item, index) => (
                  <GridItem key={item?.toString()}>
                    <Box
                      sx={{
                        position: "relative",
                        margin: theme.spacing.xs / 2,
                        "&:hover": { cursor: "grab" },
                      }}
                    >
                      <Picture
                        alt={
                          cards.find((c) => c.id === item)?.title[0] || "card"
                        }
                        srcB2={`assets/card_still_full1_${Math.abs(item)}_${
                          item > 0 ? "evolution" : "normal"
                        }.png`}
                        radius="sm"
                        sx={{
                          height: 100,
                          img: {
                            pointerEvents: "none",
                          },
                        }}
                        noAnimation
                      />
                    </Box>
                  </GridItem>
                ))}
              </GridDropZone>
            </GridContextProvider>
          </Box>
        ) : (
          <SimpleGrid cols={NUM_COLS} spacing={theme.spacing.xs}>
            {state.map((item, index) => (
              <Box key={item?.toString()}>
                <Box
                  sx={{
                    position: "relative",
                  }}
                >
                  <ActionIcon
                    variant="filled"
                    color="dark"
                    radius="sm"
                    onClick={() => handlers.remove(index)}
                    size="sm"
                    sx={(theme) => ({
                      position: "absolute",
                      top: theme.spacing.xs / 2,
                      right: theme.spacing.xs / 2,
                      zIndex: 3,
                    })}
                  >
                    <IconTrash size={12} />
                  </ActionIcon>
                  <ActionIcon
                    variant="filled"
                    color={item > 0 ? "mao_pink" : "gray"}
                    radius="sm"
                    onClick={() =>
                      handlers.applyWhere(
                        (it) => it === item,
                        (it) => it * -1
                      )
                    }
                    size="sm"
                    sx={(theme) => ({
                      position: "absolute",
                      bottom: theme.spacing.xs / 2,
                      right: theme.spacing.xs / 2,
                      zIndex: 3,
                    })}
                  >
                    <Box
                      sx={(theme) => ({
                        position: "absolute",
                        transform:
                          item > 0
                            ? "scale(1) rotate(180deg)"
                            : "scale(0) rotate(0deg)",
                        transition: theme.other.transition,
                      })}
                    >
                      <IconFlower size={12} />
                    </Box>
                    <Box
                      sx={(theme) => ({
                        opacity: item > 0 ? 0 : 1,
                        transition: theme.other.transition,
                      })}
                    >
                      <IconFlowerOff size={12} />
                    </Box>
                  </ActionIcon>

                  <Picture
                    alt={cards.find((c) => c.id === item)?.title[0] || "card"}
                    srcB2={`assets/card_still_full1_${Math.abs(item)}_${
                      item > 0 ? "evolution" : "normal"
                    }.png`}
                    radius="sm"
                    sx={{
                      height: 100,
                      img: {
                        pointerEvents: "none",
                      },
                    }}
                    noAnimation
                  />
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}
        <Group
          spacing="xs"
          mt="xs"
          sx={{
            width: "100%",
          }}
        >
          <Select
            placeholder={t("cardSearchPlaceholder")}
            value={acValue}
            onChange={(value) => {
              if (value) handlers.append(parseInt(value));
            }}
            searchable
            limit={25}
            data={[
              {
                value: "-",
                label: "Start typing to search for a card...",
                disabled: true,
              },
              ...cards
                ?.filter((c) => c?.title)
                ?.filter((c) => !state.includes(c.id))
                ?.map((c) => ({
                  label: `(${c.title[0]}) ${c?.name?.[0]}`,
                  value: c.id.toString(),
                })),
            ]}
            sx={{
              "&": {
                flexGrow: 1,
              },
            }}
            disabled={state?.length > 10 || reordering}
          />

          <Button
            // toggle reorder mode
            onClick={() => setReordering(!reordering)}
            color={reordering ? "red" : "gray"}
            variant="outline"
          >
            {reordering ? t("done") : t("reorder")}
          </Button>
        </Group>
      </Input.Wrapper>
    </>
  );
}

export default Banner;
