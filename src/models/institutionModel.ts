import mongoose, { Document, Schema } from 'mongoose';

export interface IInstitution extends Document {
    name: string;
    acronymn?: string;
    description?: string;
    location: string;
    region: string; 
    website: string;
    isActive: boolean;
}

const InstitutionSchema = new Schema<IInstitution>({
    name: {
        type: String,
        required: true,
        trim: true

    },

    acronymn: {
        type: String,
        trim: true,
        uppercase: true
    },

    description: {
        type: String,
        trim: true
    },
     location:{
        type: String,
        required: true
     },

    region:{
        type: String,
        required: true,
        trim: true
    }, 

    website: {
        type: String,
        trim: true
        
    }, 

    isActive: {
        type: Boolean,
        default: true
    },
},
{
    timestamps: true,
}
);

const Institution = mongoose.model<IInstitution>(
    "Institution", InstitutionSchema)

export default Institution;
