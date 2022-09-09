type ID = number;
type HexColorWithTag = string;

// CHARACTERS

type CharacterID = number;
type UnitID = number;
interface GameCharacterStrings {
  last_name: string;
  first_name: string;
  last_nameRuby?: string;
  first_nameRuby?: string;
  character_voice: string;
  hobby: string;
  specialty: string;
  school?: string;
  class?: string;
  quote: string;
  tagline: string;
  introduction: string;
}

interface GameCharacter extends GameCharacterStrings {
  character_id: CharacterID;
  unit_id?: UnitID;
  unit?: string[]; // TBA: Switch to using unit IDs
  image_color?: HexColorWithTag;
  height: string;
  weight: string; // TBA: Remove units from these fields
  birthday: string; // TBA: Turn into ISO8601-compliant
  age?: number;
  blood_type: "A" | "B" | "O" | "AB";
  circle?: string[];
}

interface GameUnit {
  unit_id: UnitID;
  unit?: string;
  unit_name?: string;
  tagline?: string;
  unit_desc?: string;
  agency?: string;
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

type SkillEffect = any[];
interface SkillStrings {
  name?: string;
  description?: string;
}
interface SkillStringsLive extends SkillStrings {
  live_skill_type_name?: string;
}
interface SkillStringsSupport extends SkillStrings {
  support_skill_type_name?: string;
}
interface SkillData {
  type_id: ID;
  effect_values: SkillEffect[];
}

interface CenterSkill extends SkillData, SkillStrings {}
interface LiveSkill extends SkillData, SkillStringsLive {
  duration: number;
}
interface SupportSkill extends SkillData, SkillStringsSupport {}

interface GameCardStrings {
  title: string;
  name?: string;
  obtain?: {
    name?: string;
  };
}

interface GameCardRegional extends GameCardStrings {
  releaseDate: string;
}

interface GameCard extends GameCardRegional {
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
    min?: Stats;
    max?: Stats;
    ir?: Stats;
    ir1?: Stats;
    ir2?: Stats;
    ir3?: Stats;
    ir4?: Stats;
  };
  skills?: {
    center?: CenterSkill;
    live?: LiveSkill;
    support?: SupportSkill;
  };
  spp?: {
    song_id: ID;
    type_id?: ID;
    name?: string;
  };
}
