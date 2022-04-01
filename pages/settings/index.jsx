import { useState } from "react";
import { useUserData } from "../../services/userData";
import Title from "../../components/Title";
import Main from "../../components/Main";
import { validateUsernameDb } from "../../services/firebase";
import { useDebouncedCallback } from "use-debounce";
import Input from "../../components/core/Input";
import Button from "../../components/core/Button";
import styles from "./settings.module.scss";
import Username from "./Username";
import Setting from "./Setting";

function Page() {
  return (
    <>
      <Title title="Settings" />
      <Main>
        <Setting type="text" option="name" label="Name" defaultValue="User" />
        <Username />
        <Setting
          type="choice"
          option="dark_mode"
          label="Mode"
          options={[
            { value: false, label: "Light Mode" },
            { value: true, label: "Dark Mode" },
          ]}
          defaultValue={true}
        />
        <Setting
          type="choice"
          option="content_region"
          label="Game Region"
          options={[
            { value: "jp", label: "Japan" },
            { value: "cn", label: "Mainland China" },
            { value: "kr", label: "Korea" },
            { value: "tw", label: "Taiwan" },
            {
              value: "en",
              label: "United Kingdom, Canada, Australia",
            },
            { value: "us", label: "United States" },
          ]}
          defaultValue={"jp"}
        />
      </Main>
    </>
  );
}

export default Page;

import Layout from "../../components/Layout";
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
