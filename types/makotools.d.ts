import { GetServerSidePropsContext } from "next";
import { AuthUserContext } from "next-firebase-auth";
import { StaticImageData } from "next/image";
import { StrapiResponse } from "strapi-sdk-js";

type LoadingStatus = "success" | "error";

type Locale =
  | "en" //     English
  | "ja" //     Japanese
  | "zh-CN" //  Chinese (China)
  | "zh-TW" //  Chinese (Taiwan)
  | "ko" //     Korean
  | "id" //     Indonesian
  | "th" //     Thai
  | "fil" //    Filipino
  | "ms" //     Malay
  | "vi" //     Vietnamese
  | "pt-BR" //  Portuguese (Brazil)
  | "es" //     Spanish
  | "ru" //     Russian
  | "fr" //     French
  | "de" //     German
  | "it" //     Italian
  | "pl" //     Polish
  | "pt"; //     Portuguese

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
  dateAdded?: string;
}

/**
 * 0: completely public collection
 *
 * 1: collection is only visible to logged in users
 *
 * 2: collection is only visible to friends/following
 *
 * 3: collection is completely private
 */
type CollectionPrivacyLevel = 0 | 1 | 2 | 3;

interface CardCollection {
  id: string;
  name: string;
  privacyLevel: CollectionPrivacyLevel;
  icon: number;
  cards: CollectedCard[];
  order: number;
}

// USER

type UseWebP = "use" | "dont-use";
type NameOrder = "firstlast" | "lastfirst";
type ShowTlBadge = "none" | "unofficial" | "all";
type GameRegion = "jp" | "cn" | "kr" | "tw" | "en";
type UID = ID;
interface ProfilePicture {
  id: number;
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
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
  profile__picture?: ProfilePicture;
  profile__fave_charas: number[];
  profile__fave_units?: number[];
  profile__show_faves?: boolean;
  // private
  user__theme?: string;
  dark_mode: boolean;
  setting__name_order?: NameOrder;
  setting__show_tl_badge?: ShowTlBadge;
  setting__game_region?: GameRegion;
  setting__use_webp?: UseWebP;
  bookmarks__events?: ID[];
  bookmarks__scouts?: ID[];
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
