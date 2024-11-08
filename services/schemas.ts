import { z } from "zod";

export const jpCardSchema = z.object({
  compliant: z.boolean(),
  id: z.number().gt(2000),
  rarity: z.number().gte(1).lte(5),
  character_id: z.number(),
  type: z.number().gte(1).lte(4),
  substat_type: z.number().gte(0).lte(2),
  title: z.string(),
  name: z.string(),
  releaseDate: z
    .object({
      jp: z.date(),
      en: z.date(),
    })
    .optional(),
  obtain: z
    .object({
      type: z.union([
        z.literal("initial"),
        z.literal("gacha"),
        z.literal("event"),
      ]),
      subType: z.union([
        z.literal("initial"),
        z.literal("event"),
        z.literal("unit"),
        z.literal("feature"),
        z.literal("tour"),
        z.literal("anniv"),
      ]),
      id: z.number(),
    })
    .optional(),
  skills: z.object({
    center: z.object({
      name: z.string(),
      effect_value: z.array(z.number()),
      type_id: z.number(),
      description: z.string(),
    }),
    live: z.object({}),
  }),
});
