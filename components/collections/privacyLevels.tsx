import {
  IconFriends,
  IconLock,
  IconUserCheck,
  IconWorld,
  TablerIconsProps,
} from "@tabler/icons-react";
import Trans from "next-translate/Trans";

import { CollectionPrivacyLevel } from "types/makotools";

const PRIVACY_LEVELS: {
  icon: (props: TablerIconsProps) => JSX.Element;
  title: any;
  value: CollectionPrivacyLevel;
  color: string;
  description: any;
}[] = [
  {
    icon: IconWorld,
    title: <Trans i18nKey="user:collections.everyoneTitle" />,
    value: 0,
    color: "violet",
    description: <Trans i18nKey="user:collections.everyoneDesc" />,
  },
  {
    icon: IconUserCheck,
    title: <Trans i18nKey="user:collections.usersTitle" />,
    value: 1,
    color: "blue",
    description: <Trans i18nKey="user:collections.usersDesc" />,
  },
  {
    icon: IconFriends,
    title: <Trans i18nKey="user:collections.friendsTitle" />,
    value: 2,
    color: "yellow",
    description: <Trans i18nKey="user:collections.friendsDesc" />,
  },
  {
    icon: IconLock,
    title: <Trans i18nKey="user:collections.privateTitle" />,
    value: 3,
    color: "red",
    description: <Trans i18nKey="user:collections.privateDesc" />,
  },
];

export default PRIVACY_LEVELS;
