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

