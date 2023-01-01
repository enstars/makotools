import { IconCircle, IconHeart, IconMoodCry, IconStar } from "@tabler/icons";

import IconEnstars from "components/core/IconEnstars";

const ICONS: {
  id: string;
  name: string;
  component: React.FC;
  color: string;
  props?: { [key: string]: any };
}[] = [
  {
    id: "default",
    name: "Default",
    component: IconCircle,
    color: "dimmed",
  },
  {
    id: "heart",
    name: "Heart",
    component: IconHeart,
    color: "pink",
  },
  {
    id: "star",
    name: "Star",
    component: IconStar,
    color: "yellow",
  },
  {
    id: "cry",
    name: "Cry",
    component: IconMoodCry,
    color: "cyan",
  },
  {
    id: "fine",
    name: "fine",
    component: IconEnstars,
    color: "#ffd7a0",
    props: { unit: 2 },
  },
  {
    id: "trickstar",
    name: "Trickstar",
    component: IconEnstars,
    color: "#ff8b0d",
    props: { unit: 1 },
  },
  {
    id: "ryuseitai",
    name: "流星隊",
    component: IconEnstars,
    color: "#d8162d",
    props: { unit: 5 },
  },
  {
    id: "alkaloid",
    name: "ALKALOID",
    component: IconEnstars,
    color: "#2bb7ca",
    props: { unit: 15 },
  },
  {
    id: "eden",
    name: "Eden",
    component: IconEnstars,
    color: "#5f5b5d",
    props: { unit: 14 },
  },
  {
    id: "valkyrie",
    name: "Valkyrie",
    component: IconEnstars,
    color: "#8c2346",
    props: { unit: 9 },
  },
  {
    id: "2wink",
    name: "2wink",
    component: IconEnstars,
    color: "#ff3b9a",
    props: { unit: 7 },
  },
  {
    id: "crazyb",
    name: "Crazy:B",
    component: IconEnstars,
    color: "#ffd400",
    props: { unit: 16 },
  },
  {
    id: "undead",
    name: "UNDEAD",
    component: IconEnstars,
    color: "#64368f",
    props: { unit: 3 },
  },
  {
    id: "rabits",
    name: "Ra*bits",
    component: IconEnstars,
    color: "#68c0f4",
    props: { unit: 6 },
  },
  {
    id: "akatsuki",
    name: "紅月",
    component: IconEnstars,
    color: "#962828",
    props: { unit: 8 },
  },
  {
    id: "knights",
    name: "Knights",
    component: IconEnstars,
    color: "#305daa",
    props: { unit: 4 },
  },
  {
    id: "switch",
    name: "Switch",
    component: IconEnstars,
    color: "#a3ea34",
    props: { unit: 10 },
  },
  {
    id: "mam",
    name: "MaM",
    component: IconEnstars,
    color: "#5a6964",
    props: { unit: 11 },
  },
  {
    id: "doubleface",
    name: "Double Face",
    component: IconEnstars,
    color: "#2c4f54",
    props: { unit: 17 },
  },
];

export { ICONS };
