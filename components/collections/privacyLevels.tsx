import {
  IconFriends,
  IconLock,
  IconUserCheck,
  IconWorld,
  TablerIconsProps,
} from "@tabler/icons-react";

import { CollectionPrivacyLevel } from "types/makotools";

const PRIVACY_LEVELS: {
  icon: (props: TablerIconsProps) => JSX.Element;
  title: string;
  value: CollectionPrivacyLevel;
  color: string;
  description: string;
}[] = [
  {
    icon: IconWorld,
    title: "Everyone",
    value: 0,
    color: "violet",
    description: "Everyone can see this collection.",
  },
  {
    icon: IconUserCheck,
    title: "Users",
    value: 1,
    color: "blue",
    description: "Only signed-in users can see this collection.",
  },
  {
    icon: IconFriends,
    title: "Friends",
    value: 2,
    color: "yellow",
    description: "Only your friends can see this collection.",
  },
  {
    icon: IconLock,
    title: "No One",
    value: 3,
    color: "red",
    description: "Only you can see this collection.",
  },
];

export default PRIVACY_LEVELS;
