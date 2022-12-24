import {
  ActionIcon,
  Box,
  createStyles,
  Input,
  Select,
  Switch,
  Text,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { IconSun, IconSunOff, IconX } from "@tabler/icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GridContextProvider, GridDropZone, GridItem } from "react-grid-drag";

import useUser from "services/firebase/user";
import { GameCard } from "types/game";
import Picture from "components/core/Picture";

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
  profileState,
}: {
  cards: GameCard[] | undefined;
  externalSetter: Dispatch<SetStateAction<any>>;
  profileState: any;
}) {
  const user = useUser();
  const [acValue, setAcValue] = useState("");

  const { classes, cx } = useStyles();
  const [state, handlers] = useListState(
    (user.loggedIn && user.db?.profile__banner) || []
  );

  const NUM_COLS = 3;
  const ROW_HEIGHT = 106;
  const height = Math.ceil(state.length / NUM_COLS) * ROW_HEIGHT;

  useEffect(() => {
    if (
      user.loggedIn &&
      user.db?.profile__banner &&
      JSON.stringify(user.db.profile__banner) !== JSON.stringify(state)
    ) {
      externalSetter({ ...profileState, profile__banner: state });
    }
  }, [state]);

  if (!cards)
    return (
      <Text color="dimmed" size="sm">
        Error fetching card data.
      </Text>
    );

  return (
    <Input.Wrapper label="Banner Cards">
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
            <GridItem key={Math.abs(item)}>
              <Box
                sx={{
                  position: "relative",
                  margin: "3px 5px",
                  "&:hover": { cursor: "grab" },
                }}
              >
                <ActionIcon
                  onClick={() => handlers.remove(index)}
                  sx={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}
                >
                  <IconX
                    color="white"
                    strokeWidth={3}
                    style={{
                      filter: "drop-shadow(0px 0px 1px rgb(0 0 0))",
                    }}
                  />
                </ActionIcon>
                <Switch
                  checked={item > 0}
                  onLabel={<IconSun />}
                  offLabel={<IconSunOff />}
                  onChange={(event) =>
                    handlers.applyWhere(
                      (i) => i === item,
                      (i) => i * -1
                    )
                  }
                  size="lg"
                  styles={(theme) => ({
                    root: {
                      position: "absolute",
                      zIndex: 10,
                      filter: "drop-shadow(0px 0px 1px rgb(0 0 0))",
                      padding: 0,
                    },
                    body: {
                      height: "100%",
                    },
                    track: {
                      borderRadius: 0,
                      borderBottomRightRadius: theme.radius.md,
                      borderTopLeftRadius: theme.radius.sm,
                    },
                  })}
                />
                <Picture
                  alt={cards.find((c) => c.id === item)?.title[0] || "card"}
                  srcB2={`assets/card_still_full1_${Math.abs(item)}_${
                    item > 0 ? "evolution" : "normal"
                  }.png`}
                  radius={4}
                  sx={{
                    height: 100,
                    img: {
                      pointerEvents: "none",
                    },
                  }}
                />
              </Box>
            </GridItem>
          ))}
        </GridDropZone>
      </GridContextProvider>
      <Select
        placeholder="Type to search for a card"
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
        mt="xs"
        disabled={state?.length > 10}
      />
    </Input.Wrapper>
  );
}

export default Banner;
