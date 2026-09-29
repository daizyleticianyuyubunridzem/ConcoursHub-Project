import mongoose, { Document, Schema } from "mongoose";

export interface ISavedOpportunity extends Document {
    user: mongoose.Types.ObjectId;
    admissionOpportunity: mongoose.Types.ObjectId;
}

const savedOpportunitySchema = new Schema<ISavedOpportunity>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },


        admissionOpportunity: {
            type: Schema.Types.ObjectId,
            ref: "AdmissionOpportunity",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent the same user from saving the same opportunity twice
savedOpportunitySchema.index(
    {
        user: 1,
        admissionOpportunity: 1,
    },
    {
        unique: true,
    }
);

const SavedOpportunity = mongoose.model<ISavedOpportunity>( 
    "SavedOpportunity",
    savedOpportunitySchema
);

export default SavedOpportunity;