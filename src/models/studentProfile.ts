import mongoose, { Document, Schema } from 'mongoose';

export interface IStudentProfile extends Document{
    name: string;
    phone: string,
    email: string;
    series: string;
    subjects: string;   
}

const ProfileSchema = new Schema <IStudentProfile> (
    {
        name: {
            type: String,
            required: true,
            trim: true

        },

        phone: { 
            type: String,
            required: true,

        },

        email: { 
            type: String,
            required: true,
            lowercase: true
        }

    }

)
