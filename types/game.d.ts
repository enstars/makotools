type ID = number;
type HexColorWithTag = string;

// CHARACTERS

type CharacterID = ID;
type UnitID = ID;

/** Strings extracted from the game, or translated strings  */
type Text = string;

interface GameCharacterStrings<Type> {
  last_name: Type;
  first_name: Type;
  last_nameRuby?: Type;
  first_nameRuby?: Type;
  character_voice: Type;
  hobby: Type;
  specialty: Type;
  school?: Type;
  class?: Type;
  quote: Type;
  tagline: Type;
  introduction: Type;
}

interface GameCharacter<T = string[]> extends GameCharacterStrings<T> {
  character_id: CharacterID;
  unit: ID[];
  image_color?: HexColorWithTag;
  height: string;
  weight: string; // TBA: Remove units from these fields
  birthday: string; // TBA: Turn into ISO8601-compliant
  age?: number;
  blood_type: "A" | "B" | "O" | "AB";
  circle?: string[];
  sort_id: number;
  horoscope: number;
  renders: {
    fs1_5: number;
    fs1_4: number;
    unit: number;
  };
}

interface GameAgencyString<T> {
  name: T;
  description: T;
}

interface GameAgency<T = string[]> extends GameAgencyString<T> {
  id: ID;
  order: number;
}

interface GameUnitString<T> {
  name: T;
  tagline: T;
  description: T;
}

interface GameUnit<T = string[]> extends GameUnitString<T> {
  id: ID;
  agency: ID;
  image_color?: HexColorWithTag;
  order: number;
}

// CARDS

type CardID = number;
type CardRarity = 1 | 2 | 3 | 4 | 5;
type CardAttribute = 1 | 2 | 3 | 4;
type CardSubStat = 0 | 1 | 2;
type ObtainType = "gacha" | "event" | "special" | "campaign";
type ObtainSubType =
  | "initial"
  | "event"
  | "unit"
  | "feature"
  | "tour"
  | "shuffle"
  | "anniv";

type Stat = number;
interface Stats {
  da: Stat;
  vo: Stat;
  pf: Stat;
}
type StatLevel = "min" | "max" | "ir" | "ir1" | "ir2" | "ir3" | "ir4";

type SkillEffect = any[];
interface SkillStrings<T> {
  name?: T;
  description?: T;
}
interface SkillStringsLive<T> extends SkillStrings<T> {
  live_skill_type_name?: T;
}
interface SkillStringsSupport<T> extends SkillStrings<T> {
  support_skill_type_name?: T;
}
interface SkillData {
  type_id: ID;
  effect_values: SkillEffect[];
}
type SkillType = "center" | "live" | "support";

interface CenterSkill<T> extends SkillData, SkillStrings<T> {}
interface LiveSkill<T> extends SkillData, SkillStringsLive<T> {
  duration: number;
}
interface SupportSkill<T> extends SkillData, SkillStringsSupport<T> {}

interface GameCardStrings<T> {
  title: T;
  name?: T;
  obtain?: {
    name?: T;
  };
}

interface GameCardRegional<T> extends GameCardStrings<T> {
  releaseDate: T;
}

interface GameCard<T = string[]> extends GameCardRegional<T> {
  id: CardID;
  rarity: CardRarity;
  character_id: CharacterID;
  type: CardAttribute;
  substat_type: CardSubStat;
  obtain?: {
    type?: ObtainType;
    subType?: ObtainSubType;
    id?: ID;
  };
  stats?: {
    [Level in StatLevel]: Stats;
  };
  skills?: {
    ["center"]?: CenterSkill<T>;
    ["live"]?: LiveSkill<T>;
    ["support"]?: SupportSkill<T>;
  };
  spp?: {
    song_id: ID;
    type_id?: ID;
    name?: string;
  };
}

type EventType =
  | "birthday"
  | "scout"
  | "feature scout"
  | "song"
  | "tour"
  | "shuffle"
  | "anniversary"
  | "other";
export type GameEventStatus = "start" | "end" | undefined;

export interface Event {
  name: string;
  start_date: string;
  end_date: string;
  type: EventType;
  story_name?: string;
  story_author?: string;
  story_season?: string;
  banner_id?: ID | ID[];
  five_star?: {
    chara_id: ID[];
    card_id: ID[];
  };
  four_star?: {
    chara_id: ID[];
    card_id: ID[];
  };
  three_star?: {
    chara_id: ID[];
    card_id: ID[];
  };
}

export interface GameEvent extends Event {
  event_id: ID;
  event_gacha?: string;
  gacha_id?: ID;
  intro_lines?: string;
  intro_lines_tl_credits?: string;
  song_name?: string;
  unit_id?: ID[];
}

export interface ScoutEvent extends Event {
  gacha_id: ID;
  event_id?: ID;
  intro_lines?: string;
  intro_lines_tl_credits?: string;
}

export interface BirthdayEvent extends Event {
  character_id: ID;
  horoscope?: ID;
}

export type EventType = BirthdayEvent | GameEvent | ScoutEvent;
