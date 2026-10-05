import mongoose, { Document, Schema } from "mongoose";
export interface IDepartment extends Document {
    name: string;
    acronym?: string;
    description?: string;

    // Stores the ID of the School this Department belongs to
    school: mongoose.Types.ObjectId;
    isActive: boolean;
}
const departmentSchema = new Schema<IDepartment>(
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

        
        school: {
            type: Schema.Types.ObjectId,
            ref: "School",
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

const Department = mongoose.model<IDepartment>(
    "Department",
    departmentSchema
);


export default Department;