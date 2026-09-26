import mongoose, { Document, Schema } from "mongoose";

// TypeScript interface defining  the structure of a Programme
export interface IProgramme extends Document {
    name: string;
    acronym?: string;
    description?: string;
    department: mongoose.Types.ObjectId;
    isActive: boolean;
}

// Mongoose schema that defines how Programme documents are stored
const programmeSchema = new Schema<IProgramme>(
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

        // Reference to the Department that owns this programme
        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
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

const Programme = mongoose.model<IProgramme>(
    "Programme",
    programmeSchema
);


export default Programme;