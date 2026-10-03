import { z } from "zod";

const examResultSchema = z.object({
    subject: z
        .string()
        .trim()
        .min(2, "Subject name must be at least 2 characters long."),

    grade: z.enum(
        ["A", "B", "C", "D", "E", "F"],
        {
            message: "Grade must be between A and F.",
        }
    ),
});

const otherQualificationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Qualification name must be at least 2 characters long."),

    year: z
        .number()
        .int("Year must be a whole number.")
        .min(1900, "Invalid year.")
        .optional(),

    details: z
        .string()
        .trim()
        .optional(),
});

const studentProfileBaseSchema = z.object({

    user: z
        .string()
        .trim()
        .min(1, "User ID is required."),

    dateOfBirth: z
        .coerce
        .date({
            message: "A valid date of birth is required.",
        })
        .optional(),

    background: z.enum(
        ["general", "technical"],
        {
            message:
                "Educational background must be either general or technical.",
        }
    ),

    academicStatus: z.enum(
        ["lower_sixth", "upper_sixth", "completed"],
        {
            message:
                "Academic status must be lower_sixth, upper_sixth, or completed.",
        }
    ),

    oLevelYear: z
        .number()
        .int("O-Level year must be a whole number.")
        .min(1900, "Invalid O-Level year.")
        .optional(),

    oLevelResults: z
        .array(examResultSchema)
        .min(4, "At least 4 O-Level subjects are required.")
        .max(11, "A maximum of 11 O-Level subjects is allowed.")
        .optional(),

    aLevelYear: z
        .number()
        .int("A-Level year must be a whole number.")
        .min(1900, "Invalid A-Level year.")
        .optional(),

    aLevelSeries: z
        .string()
        .trim()
        .min(1, "A-Level series cannot be empty.")
        .optional(),

    aLevelResults: z
        .array(examResultSchema)
        .min(2, "At least 2 A-Level subjects are required.")
        .max(5, "A maximum of 5 A-Level subjects is allowed.")
        .optional(),

    otherQualifications: z
        .array(otherQualificationSchema)
        .optional(),
});

export const createStudentProfileSchema =
    studentProfileBaseSchema.superRefine((data, ctx) => {

        // O-Level year cannot be later than A-Level year.
        if (
            data.oLevelYear !== undefined &&
            data.aLevelYear !== undefined &&
            data.oLevelYear > data.aLevelYear
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["oLevelYear"],
                message:
                    "O-Level year cannot be later than A-Level year.",
            });
        }

        // A-Level information is required
        // when the student has completed A-Level.
        if (data.academicStatus === "completed") {

            if (data.aLevelYear === undefined) {
                ctx.addIssue({
                    code: "custom",
                    path: ["aLevelYear"],
                    message:
                        "A-Level year is required for completed students.",
                });
            }

            if (!data.aLevelSeries) {
                ctx.addIssue({
                    code: "custom",
                    path: ["aLevelSeries"],
                    message:
                        "A-Level series is required for completed students.",
                });
            }

            if (!data.aLevelResults) {
                ctx.addIssue({
                    code: "custom",
                    path: ["aLevelResults"],
                    message:
                        "A-Level results are required for completed students.",
                });
            }
        }
    });

export const updateStudentProfileSchema =
    studentProfileBaseSchema.partial();