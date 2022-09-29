import {
  createEmotionCache,
  Input,
  MantineProvider,
  Tabs,
  Textarea,
  TypographyStylesProvider,
} from "@mantine/core";
import Markdown from "marked-react";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import dynamic from "next/dynamic";
import {
  createRef,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Head from "next/head";
import Frame, { FrameContextConsumer, useFrame } from "react-frame-component";
import { IconPencil, IconTextCaption } from "@tabler/icons";

import TextSetting from "../shared/TextSetting";
import useUser from "../../../services/firebase/user";
import { CONSTANTS } from "../../../services/makotools/constants";
import BioDisplay from "../../../components/sections/BioDisplay";

function Name() {
  const user = useUser();
  if (!user.loggedIn) return null;

  return (
    <>
      <Input.Wrapper
        label="Bio"
        description="You can use markdown in your bio (GFM)"
      >
        <Tabs variant="pills" defaultValue="edit" mt="xs">
          <Tabs.List>
            <Tabs.Tab value="edit" icon={<IconPencil size={14} />}>
              Edit
            </Tabs.Tab>
            <Tabs.Tab value="preview" icon={<IconTextCaption size={14} />}>
              Preview
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="edit" pt="xs">
            <TextSetting
              label=""
              dataKey="profile__bio"
              placeholder="Say something about yourself!"
              charLimit={3640}
              Component={Textarea}
              minRows={2}
              maxRows={50}
              showCharCount
            />
          </Tabs.Panel>

          <Tabs.Panel value="preview" pt="xs">
            <BioDisplay rawBio={user.db?.profile__bio} />
          </Tabs.Panel>
        </Tabs>
      </Input.Wrapper>
    </>
  );
}

export default Name;
