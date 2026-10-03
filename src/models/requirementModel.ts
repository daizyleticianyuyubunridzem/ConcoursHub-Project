import mongoose, { Document, Schema } from "mongoose";

export interface IRequirement extends Document {
    applicationSession: mongoose.Types.ObjectId;

    type: string;
    name: string;
    description?: string;

    level?: "o_level" | "a_level";

    subject?: string;
    minimumGrade?: string;

    requiredSeries?: string;
    requiredBackground?: "general" | "technical";

    minimumAge?: number;
    maximumAge?: number;

    isMandatory: boolean;
}

const requirementSchema = new Schema<IRequirement>(
    {
        applicationSession: {
            type: Schema.Types.ObjectId,
            ref: "ApplicationSession",
            required: true,
        },

        type: {
            type: String,
            required: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        level: {
            type: String,
            enum: ["o_level", "a_level"],
        },

        subject: {
            type: String,
            trim: true,
        },

        minimumGrade: {
            type: String,
            trim: true,
        },

        requiredSeries: {
            type: String,
            trim: true,
        },

        requiredBackground: {
            type: String,
            enum: ["general", "technical"],
        },

        minimumAge: {
            type: Number,
        },

        maximumAge: {
            type: Number,
        },

        isMandatory: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Requirement = mongoose.model<IRequirement>(
    "Requirement",
    requirementSchema
);

export default Requirement;