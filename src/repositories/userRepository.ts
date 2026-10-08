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
