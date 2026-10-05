import { z } from "zod";

const objectIdSchema = z
    .string()
    .trim()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Must be a valid MongoDB ObjectId."
    );

const departmentBaseSchema = z.object({

    name: z
        .string()
        .trim()
        .min(2, "Department name must be at least 2 characters long."),

    acronym: z
        .string()
        .trim()
        .min(2, "Acronym must be at least 2 characters long.")
        .optional(),

    description: z
        .string()
        .trim()
        .optional(),

    school: objectIdSchema,

    isActive: z
        .boolean()
        .default(true),
});

export const createDepartmentSchema =
    departmentBaseSchema;

export const updateDepartmentSchema =
    departmentBaseSchema.partial();