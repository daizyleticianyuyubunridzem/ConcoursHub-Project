import { z } from "zod";

const registerUserSchema = z.object({

    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters long."),

    email: z
        .string()
        .trim()
        .email("Please provide a valid email address."),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters long."),

});

export const createUserSchema = registerUserSchema;

export const loginUserSchema = z.object({

    email: z
        .string()
        .trim()
        .email("Please provide a valid email address."),

    password: z
        .string()
        .min(1, "Password is required."),

});

export const passwordResetRequestSchema = z.object({
    email: z.string().trim().email("Please provide a valid email address."),
});

export const passwordResetSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match.",
    path: ["confirmPassword"],
});

export const updateUserStatusSchema = z.object({
    isActive: z.boolean(),
});

export const updateAdminAccountSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long."),
    email: z.string().trim().email("Please provide a valid email address."),
    password: z.union([
        z.literal(""),
        z.string().min(6, "Password must be at least 6 characters long."),
    ]),
});

