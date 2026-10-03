import { z } from "zod";

const objectIdSchema = z
    .string()
    .trim()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Must be a valid MongoDB ObjectId."
    );
const applicationSessionBaseSchema = z.object({

    admissionOpportunity: objectIdSchema,
    academicYear: z
        .string()
        .trim()
        .min(4, "Academic year is required."),

    applicationStartDate: z
        .coerce
        .date({
            message: "Application start date must be a valid date.",
        })
        .optional(),

    applicationDeadline: z
        .coerce
        .date({
            message: "Application deadline must be a valid date.",
        })
        .optional(),

    examinationDate: z
        .coerce
        .date({
            message: "Examination date must be a valid date.",
        })
        .optional(),

    status: z
        .string()
        .trim()
        .min(1, "Status is required."),

    officialApplicationUrl: z
        .string()
        .trim()
        .url("Official application URL must be a valid URL.")
        .optional(),

    lastVerifiedAt: z
        .coerce
        .date({
            message: "Last verified date must be a valid date.",
        })
        .optional(),

    isPublished: z
        .boolean()
        .default(false),
});

export const createApplicationSessionSchema =
    applicationSessionBaseSchema.superRefine((data, ctx) => {

        // Application deadline cannot be before the application start date.
        if (
            data.applicationStartDate !== undefined &&
            data.applicationDeadline !== undefined &&
            data.applicationDeadline < data.applicationStartDate
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["applicationDeadline"],
                message:
                    "Application deadline cannot be before the application start date.",
            });
        }

        // Examination date should not be before the application start date.
        if (
            data.applicationStartDate !== undefined &&
            data.examinationDate !== undefined &&
            data.examinationDate < data.applicationStartDate
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["examinationDate"],
                message:
                    "Examination date cannot be before the application start date.",
            });
        }
    });

export const updateApplicationSessionSchema =
applicationSessionBaseSchema.partial();