import {
  ActionIcon,
  Alert,
  Button,
  Group,
  MultiSelect,
  Paper,
  Select,
  SimpleGrid,
  Space,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowsSort,
  IconComet,
  IconDiamond,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconStars,
} from "@tabler/icons";
import { useEffect, useMemo, useState } from "react";

import ScoutCard from "./components/ScoutCard";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameCharacter, ScoutEvent } from "types/game";
import { QuerySuccess } from "types/makotools";
import { FSSOptions } from "types/libraries";
import { useDayjs } from "services/libraries/dayjs";
import useFSSList from "services/makotools/search";

interface ScoutViewOptions {
  searchQuery: string;
  filterFiveStar: string[];
  filterFourStar: string[];
  filterThreeStar: string[];
  filterType: string[];
}

function Page({
  scoutsQuery,
  charactersQuery,
}: {
  scoutsQuery: QuerySuccess<ScoutEvent[]>;
  charactersQuery: QuerySuccess<GameCharacter[]>;
}) {
  const { dayjs } = useDayjs();

  const scouts: ScoutEvent[] = useMemo(
    () => scoutsQuery.data,
    [scoutsQuery.data]
  );
  const characters = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const defaultView: ViewType = {
    filters: { fivestar: [], fourstar: [], threestar: [] },
    search: "",
    sort: {
      type: "id",
      ascending: false,
    },
  };

  const fssOptions = useMemo<FSSOptions<ScoutEvent>>(
    () => ({
      filters: [
        {
          type: "fivestar",
          values: [],
          function: (view: ViewType) => {
            return (c: ScoutEvent) =>
              (view.filters.fivestar as number[]).filter((value: number) =>
                c.five_star?.chara_id?.includes(value)
              ).length;
          },
        },
        {
          type: "fourstar",
          values: [],
          function: (view: ViewType) => {
            return (c: ScoutEvent) =>
              (view.filters.fourstar as number[]).filter((value: number) =>
                c.four_star?.chara_id?.includes(value)
              ).length;
          },
        },
        {
          type: "threestar",
          values: [],
          function: (view: ViewType) => {
            return (c: ScoutEvent) =>
              (view.filters.threestar as number[]).filter((value: number) =>
                c.three_star?.chara_id?.includes(value)
              ).length;
          },
        },
      ],
      sorts: [
        {
          label: "Scout ID",
          value: "id",
          function: (a: ScoutEvent, b: ScoutEvent) => a.gacha_id - b.gacha_id,
        },
        {
          label: "Start Date",
          value: "date",
          function: (a: ScoutEvent, b: ScoutEvent) =>
            dayjs(a.start_date).unix() - dayjs(b.start_date).unix(),
        },
      ],
      baseSort: "id",
      search: {
        fields: ["name"],
      },
      defaultView,
    }),
    []
  );
  const { results, view, setView } = useFSSList<ScoutEvent>(scouts, fssOptions);

  const [isMobile, setMobile] = useState<boolean>(false);

  let characterIDtoSort: { [key: number]: number } = {};
  characters.forEach((c) => {
    characterIDtoSort[c.character_id] = c.sort_id;
  });

  useEffect(() => {
    window.innerWidth <= 900 ? setMobile(true) : setMobile(false);
  }, []);

  return (
    <>
      <PageTitle title="Scouts" />
      <Alert
        icon={<IconAlertCircle size={16} strokeWidth={3} />}
        color="indigo"
      >
        Scouts are gradually being added to MakoTools. We appreciate your
        patience!
      </Alert>
      <Paper mb="sm" p="md" withBorder sx={{ marginTop: "1vh" }}>
        <Text weight="700" size="xs" color="dimmed">
          <IconSearch size="1em" /> Search Options
        </Text>
        <Group>
          <TextInput
            label="Search"
            placeholder="Type a scout name..."
            value={view.search}
            onChange={(event) => {
              setView((v) => ({
                ...v,
                search: event.target.value,
              }));
            }}
            sx={{ maxWidth: 200 }}
            variant="default"
            icon={<IconSearch size="1em" />}
          />
          <Select
            label="Sort by"
            placeholder="Select sorting option..."
            data={fssOptions.sorts}
            value={view.sort.type}
            onChange={(value) => {
              if (value)
                setView((v) => ({
                  ...v,
                  sort: {
                    ...v.sort,
                    type: value,
                  },
                }));
            }}
            sx={{ maxWidth: 200 }}
            variant="default"
            icon={<IconArrowsSort size="1em" />}
            rightSection={
              <Tooltip label="Toggle ascending/descending">
                <ActionIcon
                  onClick={() => {
                    setView((v) => ({
                      ...v,
                      sort: {
                        ...v.sort,
                        ascending: !v.sort.ascending,
                      },
                    }));
                  }}
                  variant="light"
                  color="blue"
                >
                  {view.sort.ascending ? (
                    <IconSortAscending size={16} />
                  ) : (
                    <IconSortDescending size={16} />
                  )}
                </ActionIcon>
              </Tooltip>
            }
          />
          <MultiSelect
            label="Character 5★"
            placeholder="Pick a character..."
            data={characters
              .sort(
                (a: any, b: any) =>
                  characterIDtoSort[a.character_id] -
                  characterIDtoSort[b.character_id]
              )
              .map((c: GameCharacter) => {
                return {
                  value: c.character_id.toString(),
                  label: c.first_name[0],
                };
              })}
            onChange={(val) => {
              setView((v) => ({
                ...v,
                filters: {
                  ...v.filters,
                  fivestar: val.map((id) => parseInt(id)),
                },
              }));
            }}
            sx={{ maxWidth: 400 }}
            variant="default"
            searchable
          />
          <MultiSelect
            label="Character 4★"
            placeholder="Pick a character..."
            data={characters
              .sort(
                (a: any, b: any) =>
                  characterIDtoSort[a.character_id] -
                  characterIDtoSort[b.character_id]
              )
              .map((c: GameCharacter) => {
                return {
                  value: c.character_id.toString(),
                  label: c.first_name[0],
                };
              })}
            onChange={(val) => {
              setView((v) => ({
                ...v,
                filters: {
                  ...v.filters,
                  fourstar: val.map((id) => parseInt(id)),
                },
              }));
            }}
            sx={{ maxWidth: 400 }}
            variant="default"
            searchable
          />
          <MultiSelect
            label="Character 3★"
            placeholder="Pick a character..."
            data={characters
              .sort(
                (a: any, b: any) =>
                  characterIDtoSort[a.character_id] -
                  characterIDtoSort[b.character_id]
              )
              .map((c: GameCharacter) => {
                return {
                  value: c.character_id.toString(),
                  label: c.first_name[0],
                };
              })}
            onChange={(val) => {
              setView((v) => ({
                ...v,
                filters: {
                  ...v.filters,
                  threestar: val.map((id) => parseInt(id)),
                },
              }));
            }}
            sx={{ maxWidth: 400 }}
            variant="default"
            searchable
          />
          <Button
            compact
            onClick={() => {
              setView(defaultView);
            }}
          >
            Reset all filters
          </Button>
        </Group>
      </Paper>
      <Space h="lg" />
      <Tabs
        orientation={isMobile ? "horizontal" : "vertical"}
        variant="outline"
        defaultValue="event"
      >
        <Tabs.List sx={{ position: "sticky", top: "50px" }}>
          <Tabs.Tab
            value="event"
            icon={<IconDiamond size={36} strokeWidth={2} color="#66d9e8" />}
            aria-label="Event scouts"
          >
            {!isMobile && <Title order={4}>Event Scouts</Title>}
          </Tabs.Tab>
          <Tabs.Tab
            value="feature"
            icon={<IconComet size={36} strokeWidth={2} color="#ffd43b" />}
            aria-label="Feature Scouts"
          >
            {!isMobile && <Title order={4}>Feature Scouts</Title>}
          </Tabs.Tab>
          <Tabs.Tab
            value="special"
            icon={<IconStars size={36} strokeWidth={2} color="#d0bfff" />}
            aria-label="Special Campaigns"
          >
            {!isMobile && <Title order={4}>Special Campaigns</Title>}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="event">
          {isMobile && <Space h="md" />}
          <SimpleGrid
            cols={4}
            breakpoints={[
              { maxWidth: 500, cols: 1 },
              { maxWidth: 900, cols: 3 },
            ]}
            sx={{ ["@media (min-width: 900px)"]: { marginLeft: "1vw" } }}
          >
            {scouts
              .filter((scout) => scout.type === "scout")
              .map((scout: ScoutEvent) => (
                <ScoutCard key={scout.gacha_id} scout={scout} />
              ))}
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="feature">
          {isMobile && <Space h="md" />}
          <SimpleGrid
            cols={4}
            breakpoints={[
              { maxWidth: 500, cols: 1 },
              { maxWidth: 900, cols: 3 },
            ]}
            sx={{ ["@media (min-width: 900px)"]: { marginLeft: "1vw" } }}
          >
            {scouts
              .filter((scout) => scout.type === "feature scout")
              .map((scout: ScoutEvent) => (
                <ScoutCard key={scout.gacha_id} scout={scout} />
              ))}
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const getScouts: any = await getLocalizedDataArray<ScoutEvent>(
    "scouts",
    locale,
    "gacha_id"
  );

  const getCharacters: any = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id",
    ["character_id", "first_name", "sort_id"]
  );

  return {
    props: {
      scoutsQuery: getScouts,
      charactersQuery: getCharacters,
    },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
