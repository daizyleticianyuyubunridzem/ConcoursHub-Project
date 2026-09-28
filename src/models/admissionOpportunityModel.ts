import mongoose, { Document, Schema } from "mongoose";

export interface IAdmissionOpportunity extends Document {
    name: string;
    description?: string;
    type: string;
    programmes: mongoose.Types.ObjectId[];

    // Official source where students can get more information
    officialSource?: string;

    isActive: boolean;
}

const admissionOpportunitySchema = new Schema<IAdmissionOpportunity>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        type: {
            type: String,
            required: true,
            trim: true,
        },

        programmes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Programme",
            },
        ],

        // Official website containing application information
        officialSource: {
            type: String,
            trim: true,
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

// Admission Opportunity Mongoose model
const AdmissionOpportunity = mongoose.model<IAdmissionOpportunity>(
    "AdmissionOpportunity",
    admissionOpportunitySchema
);

export default AdmissionOpportunity;