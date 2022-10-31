import { Text } from "@mantine/core";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import { retrieveEvents } from "services/events";
import getServerSideUser from "services/firebase/getServerSideUser";
import { ScoutEvent } from "types/game";

function Page({ scouts }: { scouts: ScoutEvent[] }) {
  console.log(scouts);
  return (
    <>
      <PageTitle title="Scouts" />
      {scouts.map((scout) => (
        <Text key={scout.gacha_id}>{scout.name}</Text>
      ))}
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const scoutEvents: any = await getLocalizedDataArray<ScoutEvent>(
    "scouts",
    locale,
    "gacha_id"
  );

  const scouts: ScoutEvent[] = retrieveEvents(
    {
      scouts: scoutEvents.data,
    },
    locale
  ) as ScoutEvent[];

  return {
    props: {
      scouts: scouts,
    },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
