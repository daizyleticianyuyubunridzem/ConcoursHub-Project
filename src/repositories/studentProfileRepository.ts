import StudentProfile, { IStudentProfile } from "../models/studentProfileModel";

class StudentProfileRepository {

    // Get all student profiles
    async findAll(): Promise<IStudentProfile[]> {
        return await StudentProfile.find();
    }

    //find a student profile by id
    async findById(
        id: string
    ): Promise<IStudentProfile | null> {
        return await StudentProfile.findById(id);
    }

    // Find a student profile belonging to a specific user
    async findByUserId( userId: string ): Promise<IStudentProfile | null> {
        return await StudentProfile.findOne({
            user: userId
        });
    }

    // Create a new student profile
    async create(
        data: Partial<IStudentProfile>
    ): Promise<IStudentProfile> {
        return await StudentProfile.create(data);
    }

    // Update an existing student profile
    async update(
        id: string,
        data: Partial<IStudentProfile>
    ): Promise<IStudentProfile | null> {
        return await StudentProfile.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    // Delete a student profile
    async delete(
        id: string
    ): Promise<IStudentProfile | null> {
        return await StudentProfile.findByIdAndDelete(id);
    }
}

export default new StudentProfileRepository();