import { z } from "zod";

const institutionBaseSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Institution name must be at least 2 characters long."),

    acronymn: z
        .string()
        .trim()
        .min(2, "Acronym must be at least 2 characters long.")
        .optional(),

    description: z
        .string()
        .trim()
        .optional(),

    location: z
        .string()
        .trim()
        .min(2, "Location is required."),

    region: z
        .string()
        .trim()
        .min(2, "Region is required."),

    website: z
        .string()
        .trim()
        .url("Website must be a valid URL.")
        .optional(),

    isActive: z
        .boolean()
        .default(true),
});

export const createInstitutionSchema =
    institutionBaseSchema;

export const updateInstitutionSchema =
    institutionBaseSchema.partial();