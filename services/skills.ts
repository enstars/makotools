import { CardRarity, CenterSkill, LiveSkill, SupportSkill } from "types/game";
import attributes from "data/attributes.json";
import { centerSkills, liveSkills, supportSkills } from "data/skills";

export function centerSkillParse(skill: CenterSkill) {
  const { substat, attr } = centerSkills[skill.type_id];
  return `Increases ${substat} of all ${attributes[attr].fullname} cards by ${
    substat === "All" ? 50 : 120
  }%`;
}

export function liveSkillParse(
  skill: LiveSkill,
  rarity: CardRarity,
  level: number = 5
) {
  const effect_values =
    skill?.effect_values || liveSkills[skill.duration]?.[rarity];
  return `Increases the score by ${effect_values[level - 1][1]}% for ${
    effect_values[level - 1][0]
  } seconds.`;
}

export function supportSkillParse(
  skill: SupportSkill,
  rarity: CardRarity,
  level: number = 3,
  fallback = "Unknown"
) {
  const effect_values =
    skill?.effect_values || supportSkills[skill.type_id][rarity];
  if (typeof effect_values === "undefined") return fallback;
  switch (skill.type_id) {
    case 1:
      return `Decreases the amount that Voltage lowers after a Bad/Miss.`;
    case 2:
      return `Turns ${effect_values[level - 1][0]} ${
        effect_values[level - 1][1] ? "Bad/Miss" : "Bad"
      } into ${
        ["", "", "", "Good", "Great", "Perfect"][effect_values[level - 1][2]]
      }.`;
    case 3:
      return `Turn ${effect_values[level - 1][0]} Great/Good into a Perfect.`;
    case 4:
      return `Increases the amount that the Ensemble Time Gauge rises after a Good/Great/Perfect.`;
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
    case 28:
      return `Increases the drop rate of ${
        supportSkills[skill.type_id].drop_type
      } stat pieces by ${effect_values[level - 1][0]}%.`;
    default:
      return fallback;
  }
}
