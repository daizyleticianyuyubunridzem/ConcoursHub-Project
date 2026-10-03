import { z } from "zod";

const requirementBaseSchema = z.object({

    applicationSession: z
        .string()
        .trim()
        .min(1, "Application session is required."),

    type: z.enum(
        ["subject", "series", "background", "age"],
        {
            message: "Invalid requirement type.",
        }
    ),

    name: z
        .string()
        .trim()
        .min(1, "Requirement name is required."),

    description: z
        .string()
        .trim()
        .optional(),

    level: z
        .enum(["o_level", "a_level"], {
            message: "Level must be either o_level or a_level.",
        })
        .optional(),

    subject: z
        .string()
        .trim()
        .min(2, "Subject must be at least 2 characters long.")
        .optional(),

    minimumGrade: z
        .enum(["A", "B", "C", "D", "E", "F"], {
            message: "Invalid minimum grade.",
        })
        .optional(),

    requiredSeries: z
        .string()
        .trim()
        .min(1, "Required series cannot be empty.")
        .optional(),

    requiredBackground: z
        .enum(["general", "technical"], {
            message:
                "Background must be either general or technical.",
        })
        .optional(),

    minimumAge: z
        .number()
        .int("Minimum age must be a whole number.")
        .positive("Minimum age must be greater than zero.")
        .optional(),

    maximumAge: z
        .number()
        .int("Maximum age must be a whole number.")
        .positive("Maximum age must be greater than zero.")
        .optional(),

    isMandatory: z
        .boolean()
        .default(true),
});

export const createRequirementSchema =
    requirementBaseSchema.superRefine((data, ctx) => {

        // Subject requirement
        if (data.type === "subject") {

            if (!data.level) {
                ctx.addIssue({
                    code: "custom",
                    path: ["level"],
                    message:
                        "Level is required for a subject requirement.",
                });
            }

            if (!data.subject) {
                ctx.addIssue({
                    code: "custom",
                    path: ["subject"],
                    message:
                        "Subject is required for a subject requirement.",
                });
            }

            if (!data.minimumGrade) {
                ctx.addIssue({
                    code: "custom",
                    path: ["minimumGrade"],
                    message:
                        "Minimum grade is required for a subject requirement.",
                });
            }
        }

        // Series requirement
        if (data.type === "series") {

            if (!data.requiredSeries) {
                ctx.addIssue({
                    code: "custom",
                    path: ["requiredSeries"],
                    message:
                        "Required series is necessary for a series requirement.",
                });
            }
        }

        // Background requirement
        if (data.type === "background") {

            if (!data.requiredBackground) {
                ctx.addIssue({
                    code: "custom",
                    path: ["requiredBackground"],
                    message:
                        "Required background is necessary for a background requirement.",
                });
            }
        }

        // Age requirement
        if (data.type === "age") {

            if (
                data.minimumAge === undefined &&
                data.maximumAge === undefined
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["minimumAge"],
                    message:
                        "At least one age limit is required for an age requirement.",
                });
            }
        }

        // Age range validation
        if (
            data.minimumAge !== undefined &&
            data.maximumAge !== undefined &&
            data.minimumAge > data.maximumAge
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["maximumAge"],
                message:
                    "Maximum age cannot be less than minimum age.",
            });
        }
    });

export const updateRequirementSchema =  requirementBaseSchema.partial();