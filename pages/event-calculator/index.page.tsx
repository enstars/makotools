import { Grid, Group, Paper, Select, Space, Stack, Title } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";

import ResponsiveGrid from "components/core/ResponsiveGrid";
import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { useDayjs } from "services/libraries/dayjs";

export default function EventCalculatorPage() {
  const { dayjs } = useDayjs();

  const songGroup = "Song event";
  const tourGroup = "Tour event";
  return (
    <>
      <PageTitle title="Event Calculator" />
      <Space h="xl" />
      <Grid>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Title order={4} mb="sm">
              Event information
            </Title>
            <Stack>
              <Select
                clearable
                label="Event format"
                defaultValue="song"
                data={[
                  { value: "song", label: "New song event", group: songGroup },
                  {
                    value: "shuffle",
                    label: "Shuffle event",
                    group: songGroup,
                  },
                  { value: "tour", label: "Tour event", group: tourGroup },
                  {
                    value: "large",
                    label: "Large-scale tour (w/ new song)",
                    group: tourGroup,
                  },
                  { value: "climax", label: "Climax event", group: songGroup },
                ]}
              />
              <Select
                clearable
                label="Login bonus type"
                defaultValue="normal"
                data={[
                  { value: "normal", label: "Normal (Event pass x450)" },
                  { value: "special", label: "Special (Whistle x100)" },
                  {
                    value: "evilshadowskull",
                    label: "April 15th, 2024 (Whistle x125)",
                  },
                ]}
              />
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span="content">
          <Paper withBorder p="md">
            <Title order={4} mb="sm">
              Time information
            </Title>
            <Stack>
              <Group>
                <DatePicker
                  label="Current date"
                  defaultValue={dayjs().toDate()}
                />
                <TimeInput
                  label="Current time"
                  format="12"
                  defaultValue={dayjs().toDate()}
                  icon={<IconClock size={16} />}
                />
              </Group>
              <Group mb="md">
                <DatePicker
                  label="Event end date"
                  defaultValue={dayjs().toDate()}
                />
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
}

EventCalculatorPage.getLayout = getLayout({ wide: true });
