import { z } from "zod";

const objectIdSchema = z
    .string()
    .trim()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Must be a valid MongoDB ObjectId."
    );

export const createSavedOpportunitySchema = z.object({
    
    opportunityId: objectIdSchema,

});