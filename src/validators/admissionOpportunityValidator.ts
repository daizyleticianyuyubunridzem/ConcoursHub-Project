import { z } from "zod";

const admissionOpportunityBaseSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Opportunity name must be at least 2 characters long."),

    description: z
        .string()
        .trim()
        .optional(),

    type: z
        .string()
        .trim()
        .min(2, "Opportunity type must be at least 2 characters long."),

    programmes: z
        .array(
            z.string()
                .trim()
                .min(1, "Programme ID cannot be empty.")
        )
        .optional(),

    officialSource: z
        .string()
        .trim()
        .url("Official source must be a valid URL.")
        .optional(),

    isActive: z
        .boolean()
        .default(true),
});

export const createAdmissionOpportunitySchema = admissionOpportunityBaseSchema;
export const updateAdmissionOpportunitySchema = admissionOpportunityBaseSchema.partial();