import {
  createEmotionCache,
  MantineProvider,
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
import { createPortal } from "react-dom";
import Head from "next/head";
import Frame, { FrameContextConsumer, useFrame } from "react-frame-component";

import TextSetting from "../shared/TextSetting";
import { useFirebaseUser } from "../../../services/firebase/user";
import { CONSTANTS } from "../../../services/constants";
import BioDisplay from "../../../components/sections/BioDisplay";

function Name() {
  const { firebaseUser } = useFirebaseUser();
  if (!firebaseUser.loggedIn) return null;

  return (
    <>
      <TextSetting
        label=""
        description="You can use markdown in your bio (GFM)"
        dataKey="profile__bio"
        placeholder="Say something about yourself!"
        charLimit={3640}
        Component={Textarea}
        minRows={2}
        maxRows={50}
        showCharCount
      />
      <BioDisplay />
    </>
  );
}

export default Name;
