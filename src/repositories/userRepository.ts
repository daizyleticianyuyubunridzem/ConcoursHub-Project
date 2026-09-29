import User, { IUser } from "../models/userModel";

class UserRepository {

    //get all users
    async findAll(): Promise<IUser[]> {
        return await User.find();
    }

    // Find one user by ID
    async findById( id: string ): Promise<IUser | null> {
        return await User.findById(id);
    }

    // Find a user by email
    async findByEmail( email: string  ): Promise<IUser | null> {
        return await User.findOne({ email });
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
        );
    }

    // Delete  user
    async delete( id: string ): Promise<IUser | null> {
        return await User.findByIdAndDelete(id);
    }
}


export default new UserRepository();