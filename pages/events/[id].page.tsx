import { Box } from "@mantine/core";

import { getLayout } from "components/Layout";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import { retrieveEvent } from "services/events";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameEvent } from "types/game";

function Page({ event }: { event: GameEvent }) {
  return <Box>{event.name}</Box>;
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

    return {
      props: {
        event: event,
      },
    };
  }
);

Page.getLayout = getLayout({ wide: true });
export default Page;
