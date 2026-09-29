import bcrypt from "bcrypt";

import userRepository from "../repositories/userRepository";
import { IUser } from "../models/userModel";

class AuthService {

    // Register a new student account
    async register(
        name: string,
        email: string,
        password: string
    ): Promise<IUser> 
    {
        // Check if the account with this email already exists
        const existingUser = await userRepository.findByEmail(email);

        if (existingUser) {
            throw new Error(
                "This email already exists"
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user with the default student role
        const user = await userRepository.create({
                name,
                email,
                password: hashedPassword,
                role: "student",
                isActive: true,
            });

        return user;
    }

    // Authenticate an existing user
    async login( email: string, password: string ): Promise<IUser>
     {

        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new Error(
                "Invalid email or password"
            );
        }

        if (!user.isActive) {
            throw new Error(
                "This account has been deactivated"
            );
        }

        // Compare entered password with stored password
        const passwordMatches = await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatches) {
            throw new Error(
                "Invalid email or password"
            );
        }

        return user;
    }
}


export default new AuthService();