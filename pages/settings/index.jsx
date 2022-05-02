import { useState, useEffect } from "react";
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
import { appSignOut } from "../../services/firebase";
import { useAuth } from "../../services/auth";
import { useRouter } from "next/router";

function Page() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!!!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (user?.uid)
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
              { value: "jp", label: "JP (Japan)" },
              { value: "cn", label: "CN (Mainland China)" },
              { value: "kr", label: "KR (Korea)" },
              { value: "tw", label: "TW (Taiwan)" },
              {
                value: "en",
                label: "EN (United Kingdom, Canada, Australia)",
              },
              { value: "us", label: "US (United States)" },
            ]}
            defaultValue={"jp"}
          />
          <Button onClick={appSignOut}>Log Out</Button>
        </Main>
      </>
    );
  return null;
}

export default Page;

import Layout from "../../components/Layout";
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
