import { GetServerSidePropsContext } from "next";
import { AuthUserContext } from "next-firebase-auth";
import { StaticImageData } from "next/image";
import { WP_REST_API_Post } from "wp-types";

type Locale =
  | "en" // English
  | "ja" // Japanese
  | "zh" // Standard Mandarin / Simplified
  | "zh-TW" // Taiwanese Mandarin / Traditional
  | "ko" // Korean
  // Oissu Statistics
  | "id" // Indonesian
  | "fil" // Filipino
  | "vi" // Vietnamese
  | "ru" // Russian
  | "ms" // Malaysian
  | "es" // Spanish
  | "pt" // Portugese
  | "pt-BR" // Brazilian Portugese
  | "fr" // French
  | "de" // German
  | "it" // Italian
  | "ar" // Arabic
  | "th"; // Thai

interface MkAnnouncement extends WP_REST_API_Post {}

interface CollectedCard {
  id: ID;
  count: number;
}

interface Emote {
  id: ID;
  emote: StaticImageData;
  name: string;
  stringId: string;
}

// USER

type NameOrder = "firstlast" | "lastfirst";
type ShowTlBadge = "none" | "unofficial" | "all";

interface UserData {
  collection?: CollectedCard[];
  username: string;
  name?: string;
  dark_mode: boolean;
  profile__banner?: number[];
  profile__bio?: string;
  profile__pronouns?: string;
  profile__start_playing?: string;
  setting__name_order?: NameOrder;
  setting__show_tl_badge?: ShowTlBadge;
}

interface FirebaseUser {
  loading: boolean;
  loggedIn?: boolean;
  user?: AuthUserContext;
  firestore?: UserData;
}

interface GetServerSideUserContext extends GetServerSidePropsContext {}

// DATA

type LoadedStatus = "success" | "error";

interface LoadedDataRegional {
  lang: Locale;
  source: boolean;
  status: LoadedStatus;
  data?: any;
  error?: any;
}

interface LoadedData<DataType> {
  main: DataType;
  mainLang: DataType;
  subLang: DataType;
}
