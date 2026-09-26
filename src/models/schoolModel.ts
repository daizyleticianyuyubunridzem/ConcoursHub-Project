import mongoose, { Document, Schema } from "mongoose";

export interface ISchool extends Document {
    name: string;
    acronym?: string;
    description?: string;
    institution: mongoose.Types.ObjectId;
    isActive: boolean;
}

const schoolSchema = new Schema<ISchool>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        acronym: {
            type: String,
            trim: true,
            uppercase: true,
        },

        description: {
            type: String,
            trim: true,
        },

        institution: {
            type: Schema.Types.ObjectId,
            ref: "Institution",
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const School = mongoose.model<ISchool>(
    "School",
    schoolSchema
);

export default School;