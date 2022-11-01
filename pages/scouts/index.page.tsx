import {
  Accordion,
  Alert,
  Button,
  Group,
  MultiSelect,
  Paper,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconComet,
  IconDiamond,
  IconSearch,
} from "@tabler/icons";
import { useMemo, useState } from "react";
import { useLocalStorage } from "@mantine/hooks";

import ScoutCard from "./components/ScoutCard";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import { retrieveEvents } from "services/events";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameCharacter, ScoutEvent } from "types/game";
import { QuerySuccess } from "types/makotools";

interface ScoutViewOptions {
  searchQuery: string;
  filterFiveStar: string[];
  filterFourStar: string[];
  filterThreeStar: string[];
  filterType: string[];
}

function Page({
  scouts,
  charactersQuery,
}: {
  scouts: ScoutEvent[];
  charactersQuery: QuerySuccess<GameCharacter[]>;
}) {
  const characters = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const SCOUT_VIEW_OPTIONS_DEFAULT: ScoutViewOptions = {
    searchQuery: "",
    filterFiveStar: [],
    filterFourStar: [],
    filterThreeStar: [],
    filterType: [],
  };

  const [search, setSearch] = useState<string>("");
  const [viewOptions, setViewOptions] = useLocalStorage<ScoutViewOptions>({
    key: "scoutFilters",
    defaultValue: SCOUT_VIEW_OPTIONS_DEFAULT,
  });

  let characterIDtoSort: { [key: number]: number } = {};
  characters.forEach((c) => {
    characterIDtoSort[c.character_id] = c.sort_id;
  });

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
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            sx={{ maxWidth: 200 }}
            variant="default"
            icon={<IconSearch size="1em" />}
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
            value={viewOptions.filterFiveStar}
            onChange={(val) => {
              setViewOptions({ ...viewOptions, filterFiveStar: val });
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
            value={viewOptions.filterFourStar}
            onChange={(val) => {
              setViewOptions({ ...viewOptions, filterFourStar: val });
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
            value={viewOptions.filterThreeStar}
            onChange={(val) => {
              setViewOptions({ ...viewOptions, filterThreeStar: val });
            }}
            sx={{ maxWidth: 400 }}
            variant="default"
            searchable
          />
          <Button
            compact
            onClick={() => {
              setViewOptions(SCOUT_VIEW_OPTIONS_DEFAULT);
            }}
          >
            Reset all filters
          </Button>
        </Group>
      </Paper>
      <Accordion variant="separated">
        <Accordion.Item value="event_scouts">
          <Accordion.Control>
            <Group>
              <IconDiamond size={36} strokeWidth={2} color="#99e9f2" />{" "}
              <Title order={2}>Scout Events</Title>
            </Group>
          </Accordion.Control>
          <Accordion.Panel sx={{ maxHeight: "30%", overflowY: "scroll" }}>
            <SimpleGrid cols={4} spacing="lg">
              {scouts
                .filter((scout) => scout.type === "scout")
                .map((scout) => (
                  <ScoutCard key={scout.gacha_id} scout={scout} />
                ))}
            </SimpleGrid>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="feature_scouts">
          <Accordion.Control>
            <Group>
              <IconComet size={36} strokeWidth={2} color="#ffd43b" />{" "}
              <Title order={2}>Feature Scouts</Title>
            </Group>
          </Accordion.Control>
          <Accordion.Panel sx={{ maxHeight: "30%", overflowY: "scroll" }}>
            <SimpleGrid cols={4} spacing="lg">
              {scouts
                .filter((scout) => scout.type === "feature scout")
                .map((scout) => (
                  <ScoutCard key={scout.gacha_id} scout={scout} />
                ))}
            </SimpleGrid>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
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

  const scouts: ScoutEvent[] = retrieveEvents(
    {
      scouts: getScouts.data,
    },
    locale
  ) as ScoutEvent[];

  return {
    props: {
      scouts: scouts,
      charactersQuery: getCharacters,
    },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
