import { Translate } from "next-translate";

import { CardRarity, CenterSkill, LiveSkill, SupportSkill } from "types/game";
import attributes from "data/attributes.json";
import { centerSkills, liveSkills, supportSkills } from "data/skills";

export function centerSkillParse(t: Translate, skill: CenterSkill) {
  try {
    if (!t || typeof t !== "function") return "Unknown";
    const typeId = skill?.type_id;
    if (typeId === undefined) return t("skills:unknown");

    if (typeId === 4 || typeId === 8 || typeId === 12 || typeId === 16) {
      const { attr } = centerSkills[typeId];
      return t(`skills:center.type_boost_all`, {
        attribute: attributes[attr].fullname,
        percent: skill?.effect_value[0] || "?",
      });
    } else if (typeId < 16) {
      const { substat, attr } = centerSkills[typeId];

      return t(`skills:center.type_boost`, {
        substat: substat,
        attribute: attributes[attr].fullname,
        percent: skill?.effect_value[0] || "?",
      });
    } else if (typeId === 17) {
      return t(`skills:center.all_boost`, {
        percent: skill?.effect_value[0] || "?",
        percent2: skill?.effect_value[1] || "?",
      });
    }

    return t("skills:unknown");
  } catch (error) {
    console.error(error);
    if (!t || typeof t !== "function") return "Unknown";
    else return t("skills:unknown");
  }
}

export function liveSkillParse(
  t: Translate,
  skill: LiveSkill,
  rarity: CardRarity,
  level: number = 5
) {
  try {
    if (!t || typeof t !== "function") return "Unknown";
    const typeId = skill?.type_id;
    if (typeId === undefined) return t("skills:unknown");

    // @ts-ignore
    const effect_values = liveSkills[typeId][skill.duration]?.[rarity];
    if (typeId === 1) {
      return t(`skills:live.type_${typeId}`, {
        percent: effect_values[level - 1][1] || "?",
        duration: skill.duration,
      });
    } else if (typeId === 2 || typeId === 3) {
      return t(`skills:live.type_${typeId}`, {
        percent: effect_values[level - 1][0] || "?",
        percent2: effect_values[level - 1][1] || "?",
        duration: skill.duration,
      });
    }

    return t("skills:unknown");
  } catch (error) {
    console.error(error);
    if (!t || typeof t !== "function") return "Unknown";
    return t("skills:unknown");
  }
}

export function supportSkillParse(
  t: Translate,
  skill: SupportSkill,
  rarity: CardRarity,
  level: number = 3
) {
  try {
    if (!t || typeof t !== "function") return "Unknown";
    const typeId = skill?.type_id;
    if (typeId === undefined) return t("skills:unknown");

    const effect_values = supportSkills[typeId][rarity];

    switch (typeId) {
      case 1:
      case 4:
        return t(`skills:support.type_${typeId}`);
      case 2:
        const noteCount = effect_values[level - 1][0];
        const noteTypeFrom = effect_values[level - 1][1] ? "Bad/Miss" : "Bad";
        const noteTypeTo = ["Good", "Great", "Perfect"][
          effect_values[level - 1][2] - 3
        ];
        return t(`skills:support.type_${typeId}`, {
          noteCount,
          noteTypeFrom,
          noteTypeTo,
        });
      case 3:
        const count = effect_values[level - 1][0];
        return t(`skills:support.type_${typeId}`, {
          count,
        });
      case 24:
      case 29:
      case 30:
        return t(`skills:support.type_${typeId}`, {
          percent: effect_values[level - 1][0],
        });
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
        const type = t(
          `skills:support.pieceNames.${supportSkills[typeId].drop}`
        );
        const percent = effect_values[level - 1][0];
        return t(`skills:support.type_generic`, {
          type,
          percent,
        });
      default:
        return t("skills:unknown");
    }
  } catch (error) {
    console.error(error);
    if (!t || typeof t !== "function") return "Unknown";
    return t("skills:unknown");
  }
}
