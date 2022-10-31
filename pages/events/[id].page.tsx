import { getLayout } from "components/Layout";
import { getLocalizedDataArray } from "services/data";
import { retrieveEvents } from "services/events";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameEvent } from "types/game";

function Page() {}

export const getServerSideProps = getServerSideUser(
  async ({ locale, params }) => {
    const gameEvents: any = await getLocalizedDataArray<GameEvent>(
      "events",
      locale,
      "event_id"
    );

    const events = retrieveEvents(
      {
        gameEvents: gameEvents.data,
      },
      locale
    );
  }
);

Page.getLayout = getLayout({ wide: true });
export default Page;
