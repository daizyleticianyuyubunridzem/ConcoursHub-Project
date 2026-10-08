import User, { IUser } from "../models/userModel";

class UserRepository {

    //get all users
    async findAll(): Promise<IUser[]> {
        return await User.find().select("name email role isActive createdAt");
    }

    // Find one user by ID
    async findById( id: string ): Promise<IUser | null> {
        return await User.findById(id).select("name email role isActive createdAt");
    }

    // Find a user by email
    async findByEmail( email: string  ): Promise<IUser | null> {
        return await User.findOne({ email: email.trim().toLowerCase() });
    }

    async findByPasswordResetTokenHash(tokenHash: string): Promise<IUser | null> {
        return User.findOne({
            passwordResetTokenHash: tokenHash,
            passwordResetExpiresAt: { $gt: new Date() },
            isActive: true,
        }).select("+passwordResetTokenHash +passwordResetExpiresAt");
    }

    async setPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
        await User.findByIdAndUpdate(userId, {
            $set: { passwordResetTokenHash: tokenHash, passwordResetExpiresAt: expiresAt },
        });
    }

    async updatePasswordAndClearResetToken(userId: string, password: string): Promise<void> {
        await User.findByIdAndUpdate(userId, {
            $set: { password },
            $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 },
        });
    }

    // Create a new user
    async create( data: Partial<IUser> ): Promise<IUser> {
        return await User.create(data);
    }

    // Update an existing user
    async update( id: string, data: Partial<IUser> ): Promise<IUser | null>
     {
        return await User.findByIdAndUpdate(
            id,
            data,
            {

                new: true,
                runValidators: true,
            }
        ).select("name email role isActive createdAt");
    }

    async setStudentActiveStatus(id: string, isActive: boolean): Promise<IUser | null> {
        return await User.findOneAndUpdate(
            { _id: id, role: "student" },
            { $set: { isActive } },
            { new: true, runValidators: true }
        ).select("name email role isActive createdAt");
    }

    // Delete  user
    async delete( id: string ): Promise<IUser | null> {
        return await User.findByIdAndDelete(id);
    }
}


export default new UserRepository();
