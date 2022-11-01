import { Blockquote, Box, Group } from "@mantine/core";

import Picture from "components/core/Picture";
import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import { retrieveEvent } from "services/events";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameEvent } from "types/game";

function Page({ event }: { event: GameEvent }) {
  return (
    <>
      <PageTitle title={event.name[0]} />
      <Group>
        <Box sx={{ position: "relative", flex: "1 2 100px" }}>
          <Picture
            alt={event.name}
            srcB2={`assets/card_still_full1_${event.banner_id}_evolution.png`}
            radius="sm"
            sx={{ height: 250 }}
          />
        </Box>

        <Blockquote>{event.intro_lines}</Blockquote>
      </Group>
    </>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ res, locale, params }) => {
    if (!params?.id || Array.isArray(params?.id)) return { notFound: true };

    const getEvents: any = await getLocalizedDataArray(
      "events",
      locale,
      "event_id"
    );

    console.log(params.id);

    const getEvent: any = getItemFromLocalizedDataArray(
      getEvents,
      parseInt(params.id),
      "event_id"
    );

    if (getEvent.status === "error") return { notFound: true };

    let event: GameEvent = retrieveEvent(getEvent.data);

    const title = event.name[0];
    const breadcrumbs = ["events", title];

    return {
      props: {
        event: event,
        title,
        breadcrumbs,
      },
    };
  }
);

Page.getLayout = getLayout({ wide: true });
export default Page;
