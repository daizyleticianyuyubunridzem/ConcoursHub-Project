import mongoose, {Document, Schema} from "mongoose";

export interface IDepartment extends Document {
    name: string;
    description: string;

}