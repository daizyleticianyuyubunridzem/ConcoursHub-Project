import bcrypt from "bcrypt";

import userRepository from "../repositories/userRepository";
import { IUser } from "../models/userModel";

class UserService {
    
    //Get all users
    async getAllUsers(): Promise<IUser[]> {
        return await userRepository.findAll();
    }

    // Get one user by ID
    async getUserById( id: string ): Promise<IUser | null> {
        return await userRepository.findById(id);
    }

    // Create a new user
    async createUser( data: Partial<IUser> ): Promise<IUser> {

        // Hash password before storing 
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        return await userRepository.create(data);
    }

    // find a user by email
    async getUserByEmail( email: string ): Promise<IUser | null> {
        return await userRepository.findByEmail(email);
    }

    // edit an existing user
    async updateUser( id: string,  data: Partial<IUser> 
    ): Promise<IUser | null> {

        // Hash a new password if the password is being changed
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        return await userRepository.update(id, data);
    }

    // delete a user
    async deleteUser( id: string
    ): Promise<IUser | null> {
        return await userRepository.setStudentActiveStatus(id, false);
    }

    async setStudentActiveStatus(id: string, isActive: boolean): Promise<IUser | null> {
        return await userRepository.setStudentActiveStatus(id, isActive);
    }
}

export default new UserService();
