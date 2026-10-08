import mongoose, { Document, Schema } from "mongoose";

export interface IStudentProfile extends Document {
    user: mongoose.Types.ObjectId;
    dateOfBirth?: Date | null;
    background: "general" | "technical";
    academicStatus: "lower_sixth" | "upper_sixth" | "completed";
    oLevelYear?: number | null;
    oLevelResults?: {
        subject: string;
        grade: string;
    }[];
    aLevelYear?: number | null;
    aLevelSeries?: string | null;
    aLevelResults?: {
        subject: string;
        grade: string;
    }[];
    otherQualifications?: {
        name: string;
        year?: number | null;
        details?: string;
    }[];
}

const studentProfileSchema = new Schema<IStudentProfile>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        dateOfBirth: {
            type: Date,
        },

        academicStatus: {
            type: String,
            enum: ["lower_sixth", "upper_sixth", "completed"],
            required: true,
        },
        background: {
            type: String,
            enum: ["general", "technical"],
            required: true,
        },

          //  GCE O-Level information
        oLevelYear: {
            type: Number,
        },

        oLevelResults: [
            {
                subject: {
                    type: String,
                    trim: true,
                },
                grade: {
                    type: String,
                    trim: true,
                },
            },
        ],

          //  GCE A-Level information
        aLevelYear: {
            type: Number,
        },

        aLevelSeries: {
            type: String,
            trim: true,
        },
        aLevelResults: [
            {
                subject: {
                    type: String,
                    trim: true,
                },
                grade: {
                    type: String,
                    trim: true,
                },
            },
        ],

        otherQualifications: [
            {
                name: {
                    type: String,
                    trim: true,
                },
                year: {
                    type: Number,
                },
                details: {
                    type: String,
                    trim: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const StudentProfile = mongoose.model<IStudentProfile>(
    "StudentProfile",
    studentProfileSchema
);

export default StudentProfile;
