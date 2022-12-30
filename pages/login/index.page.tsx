import { AuthAction } from "next-firebase-auth";

import Login from "./Login";

import { getLayout } from "components/Layout";
import getServerSideUser from "services/firebase/getServerSideUser";

function Page() {
  return <Login />;
}

export const getServerSideProps = getServerSideUser(
  () => {
    return { props: {} };
  },
  {
    whenAuthed: AuthAction.REDIRECT_TO_APP,
  }
);
Page.getLayout = getLayout({
  hideSidebar: true,
  hideFooter: true,
  hideHeader: true,
});
export default Page;
