import { GetServerSidePropsContext } from "next";
import { AuthUserContext } from "next-firebase-auth";
import { StaticImageData } from "next/image";
import { StrapiResponse } from "strapi-sdk-js";

type LoadingStatus = "success" | "error";

type Locale =
  | "en" // English
  | "ja" // Japanese
  | "zh" // Standard Mandarin / Simplified
  | "zh-TW" // Taiwanese Mandarin / Traditional
  | "ko" // Korean
  // MakoTools Statistics
  | "id" // Indonesian
  | "fil" // Filipino
  | "ms" // Malaysian
  | "pt-BR" // Brazilian Portugese
  | "th" // Thai
  | "vi"; // Vietnamese

interface PageMeta {
  title: string;
  desc: string;
  img: string;
}

interface MkAnnouncement {}
type HTML = string;
type RichText = HTML;

interface StrapiItem<T> {
  attributes: T;
  id: number;
}

interface MakoPostCategory {
  title: string;
}

interface MakoPost {
  slug: string;
  content: RichText;
  title: string;
  categories: StrapiResponse<StrapiItem<MakoPostCategory>[]>;
  date_created: string;
  preview?: string;
}

interface CollectedCard {
  id: ID;
  count: number;
}
// USER

type UseWebP = "use" | "dont-use";
type NameOrder = "firstlast" | "lastfirst";
type ShowTlBadge = "none" | "unofficial" | "all";
type GameRegion = "jp" | "cn" | "kr" | "tw" | "en";
type UID = ID;
interface UserData {
  set(data: any, callback?: () => any): any;
  collection?: CollectedCard[];
  suid: string;
  username: string;
  name?: string;
  profile__banner?: number[];
  profile__bio?: string;
  profile__pronouns?: string;
  profile__start_playing?: string;

  // private
  dark_mode: boolean;
  setting__name_order?: NameOrder;
  setting__show_tl_badge?: ShowTlBadge;
  setting__game_region?: GameRegion;
  setting__use_webp?: UseWebP;
  readonly admin?: {
    disableTextFields?: boolean;
    patreon?: 0 | 1 | 2 | 3 | 4;
    administrator?: boolean;
  };
}
interface UserPrivateData {
  set(data: any, callback?: () => any): any;
  friends__list?: UID[];
  friends__sentRequests?: UID[];
  friends__receivedRequests?: UID[];
}

interface UserLoading {
  loading: true;
  loggedIn: undefined;
}
interface UserLoggedOut {
  loading: false;
  loggedIn: false;
}

interface UserLoggedIn {
  loading: false;
  loggedIn: true;
  user: AuthUserContext;
  db: UserData;
  privateDb: UserPrivateData;
  refreshData: () => void;
}

type User = UserLoading | UserLoggedOut | UserLoggedIn;

interface GetServerSideUserContext extends GetServerSidePropsContext {}

// DATA

/** Language data */
interface Lang {
  /** Language of data */
  locale: Locale;
  /** If data is directly collected from the game (mainly for translations) */
  source: boolean;
}

/** A succesful query from the data repos */
interface QuerySuccess<D> {
  lang: Lang[];
  status: "success";
  data: D;
}

/** A failed query from the data repos */
interface QueryError {
  lang: Lang[];
  status: "error";
  error: any;
  data: undefined;
}

/** A query from the data repos */
type Query<D> = QuerySuccess<D> | QueryError;

/** Returns a version of the type without localization */
type Unlocalized<T> = T<string>;

/** Shorthand for Unlocalized; Returns a version of the type without localization */
type UL<T> = T<string>;

interface Emote {
  id: ID;
  emote: StaticImageData;
  name: string;
  stringId: string;
}

interface DbReaction {
  id: ID;
  attributes: {
    content: string;
    user: UID;
    page: string;
    createdAt: string;
  };
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
