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

interface PageMeta {
  title: string;
  desc: string;
  img: string;
}

interface MkAnnouncement extends WP_REST_API_Post {}

interface CollectedCard {
  id: ID;
  count: number;
}
// USER

type NameOrder = "firstlast" | "lastfirst";
type ShowTlBadge = "none" | "unofficial" | "all";
type GameRegion = "jp" | "cn" | "kr" | "tw" | "en";
type UID = ID;
interface UserData {
  collection?: CollectedCard[];
  suid: string;
  username: string;
  name?: string;
  dark_mode: boolean;
  profile__banner?: number[];
  profile__bio?: string;
  profile__pronouns?: string;
  profile__start_playing?: string;
  setting__name_order?: NameOrder;
  setting__show_tl_badge?: ShowTlBadge;
  setting__game_region: GameRegion;
  readonly admin: any;
}

interface FirebaseUserLoading {
  loading: true;
  loggedIn: undefined;
}
interface FirebaseUserLoggedOut {
  loading: false;
  loggedIn: false;
}

interface FirebaseUserLoggedIn {
  loading: false;
  loggedIn: true;
  user: AuthUserContext;
  firestore: UserData;
}

type FirebaseUser =
  | FirebaseUserLoading
  | FirebaseUserLoggedOut
  | FirebaseUserLoggedIn;

interface GetServerSideUserContext extends GetServerSidePropsContext {}

// DATA

type LoadedStatus = "success" | "error";

interface LoadedDataRegionalLang {
  lang: Locale;
  source: boolean;
}
interface LoadedDataRegionalSuccess<D> extends LoadedDataRegionalLang {
  status: "success";
  data: D;
}
interface LoadedDataRegionalError extends LoadedDataRegionalLang {
  status: "error";
  error: any;
}

type LoadedDataRegional<D = any> =
  | LoadedDataRegionalSuccess<D>
  | LoadedDataRegionalError;

interface LoadedDataLocalized<D, S = D> {
  main: D;
  mainLang: D;
  subLang: S;
}
interface LoadedData<D, S = D>
  extends LoadedDataLocalized<
    LoadedDataRegionalSuccess<D>,
    LoadedDataRegional<S>
  > {}

interface Emote {
  id: ID;
  emote: StaticImageData;
  name: string;
  stringId: string;
}

interface DbReaction {
  content: string;
  id: ID;
  name: UID;
  page_id: string;
  submit_date: string;
}

interface Reaction {
  emote: Emote;
  id: string;
  alt: string;
}

type MonthName =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";
type MonthLength = 28 | 29 | 30 | 31;

interface CalendarMonth {
  name: MonthName;
  amount_of_days: MonthLength;
}
