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
  set(data: any, callback?: () => any): any;
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

type EventType = "birthday" | "scout" | "gameEvent";

interface EventDate {
  month: number;
  date: number;
  year?: number | undefined;
}

interface CalendarEvent {
  type: EventType;
  startDate: EventDate;
  endDate?: string | Date;
}

interface BirthdayEvent extends CalendarEvent {
  character_id: number;
  character_name: string;
  character_render: any;
}
