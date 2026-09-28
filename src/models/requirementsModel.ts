import mongoose, { Document, Schema } from "mongoose";

// TypeScript interface that defines the structure of a Requirement
export interface IRequirement extends Document {
    applicationSession: mongoose.Types.ObjectId;
    type: string;
    name: string;
    description?: string;
    subject?: string;
    minimumGrade?: string;
    minimumAge?: number;
    maximumAge?: number;
    isMandatory: boolean;
}


const requirementSchema = new Schema<IRequirement>(
    {
        // The application session this requirement belongs to
        applicationSession: {
            type: Schema.Types.ObjectId,
            ref: "ApplicationSession",
            required: true,
        },

        // Type of requirement - Example: Subject, Grade, Age, Qualification
        type: {
            type: String,
            required: true,
            trim: true,
        },

        // Short name of the requirement
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        // Subject involved in the requirement
        subject: {
            type: String,
            trim: true,
        },

        //min grade if application
        minimumGrade: {
            type: String,
            trim: true,
        },

        //mininum age if applicable
        minimumAge: {
            type: Number,
        },
        
         //mininum age if applicable
        maximumAge: {
            type: Number,
        },

        isMandatory: {
            type: Boolean,
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