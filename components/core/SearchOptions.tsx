import {
  Accordion,
  Button,
  Group,
  Paper,
  Text,
  TextInput,
  TextInputProps,
  useMantineTheme,
} from "@mantine/core";
import {
  IconEye,
  IconFilter,
  IconFilterOff,
  IconSearch,
} from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import React, { ReactNode } from "react";

function SearchOptions({
  searchProps,
  filters,
  display,
  resetFilters = () => {},
}: {
  searchProps?: TextInputProps;
  filters?: ReactNode;
  display?: ReactNode;
  resetFilters?: () => void;
}) {
  const theme = useMantineTheme();
  const { t } = useTranslation("common");
  return (
    <Paper mb="sm" withBorder radius="sm" sx={{ overflow: "hidden" }}>
      {/* <Text weight="700" size="xs" color="dimmed">
        <IconSearch size="1em" /> {t("search.searchOptions")}
      </Text> */}
      {searchProps && (
        <TextInput
          {...searchProps}
          styles={{
            input: {
              "&&&&&": {
                padding: theme.spacing.sm,
                paddingLeft: 44,
                borderWidth: 0,
              },
            },
            icon: {
              "&&&&&": {
                paddingLeft: 16,
                width: 32,
              },
            },
          }}
          icon={
            <Text color="dimmed" inline>
              <IconSearch size={16} />
            </Text>
          }
        />
      )}
      <Accordion
        radius={0}
        variant="default"
        defaultValue={[]}
        multiple
        styles={{
          item: {
            borderBottom: 0,
            borderTop: `solid 1px ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[3]
            }`,
          },
          control: {
            paddingTop: theme.spacing.xs * 0.75,
            paddingBottom: theme.spacing.xs * 0.75,
          },
        }}
      >
        {filters && (
          <Accordion.Item value="filters">
            <Accordion.Control
              icon={
                <Text color="dimmed" inline>
                  <IconFilter size={16} />
                </Text>
              }
            >
              <Group>
                <Text
                  size="sm"
                  weight={400}
                  color="dimmed"
                  sx={{ "&&&": { flexGrow: 1 } }}
                >
                  {t("search.filters")}
                </Text>
                <Button
                  size="xs"
                  compact
                  variant="light"
                  color="gray"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetFilters();
                  }}
                  leftIcon={<IconFilterOff size={12} />}
                >
                  {t("search.resetFilters")}
                </Button>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>{filters}</Accordion.Panel>
          </Accordion.Item>
        )}
        {display && (
          <Accordion.Item value="display">
            <Accordion.Control
              icon={
                <Text color="dimmed" inline>
                  <IconEye size={16} />
                </Text>
              }
            >
              <Text size="sm" weight={400} color="dimmed">
                {t("search.viewOptions")}
              </Text>
            </Accordion.Control>
            <Accordion.Panel>{display}</Accordion.Panel>
          </Accordion.Item>
        )}
      </Accordion>
    </Paper>
  );
}

export default SearchOptions;
