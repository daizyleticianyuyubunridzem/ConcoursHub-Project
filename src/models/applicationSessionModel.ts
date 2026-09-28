import mongoose, { Document, Schema } from "mongoose";


export interface IApplicationSession extends Document {
    admissionOpportunity: mongoose.Types.ObjectId;
    academicYear: string;
    applicationStartDate?: Date;
    applicationDeadline?: Date;
    examinationDate?: Date;
    status: string;
    officialApplicationUrl?: string;
    lastVerifiedAt?: Date;
    isPublished: boolean;
}

const applicationSessionSchema = new Schema<IApplicationSession>(
    {
        admissionOpportunity: {
            type: Schema.Types.ObjectId,
            ref: "AdmissionOpportunity",
            required: true,
        },

        // Academic year for this particular admission session
        academicYear: {
            type: String,
            required: true,
            trim: true,
        },

        // Date when applications officially open
        applicationStartDate: {
            type: Date,
        },

        applicationDeadline: {
            type: Date,
        },

        examinationDate: {
            type: Date,
        },

        // Current status of this application session 
        status: {
            type: String,
            required: true,
            trim: true,
        },

        officialApplicationUrl: {
            type: String,
            trim: true,
        },

        lastVerifiedAt: {
            type: Date,
        },

        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const ApplicationSession = mongoose.model<IApplicationSession>(
    "ApplicationSession", applicationSessionSchema );

    
export default ApplicationSession;