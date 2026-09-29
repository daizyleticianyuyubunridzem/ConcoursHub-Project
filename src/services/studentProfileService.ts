import studentProfileRepository from "../repositories/studentProfileRepository";
import { IStudentProfile } from "../models/studentProfileModel";

class StudentProfileService {

    // Get all profiles
    async getAllStudentProfiles(): Promise<IStudentProfile[]> {
        return await studentProfileRepository.findAll();
    }

    // Get one student profile by ID
    async getStudentProfileById(
        id: string
    ): Promise<IStudentProfile | null> {
        return await studentProfileRepository.findById(id);
    }

    // Get profile belonging to a specific user
    async getStudentProfileByUserId( userId: string ): Promise<IStudentProfile | null> {
        return await studentProfileRepository.findByUserId(userId);
    }

    // Create a new student profile
    async createStudentProfile(
        data: Partial<IStudentProfile>
    ): Promise<IStudentProfile> {
        return await studentProfileRepository.create(data);
    }

    // Update an existing student profile
    async updateStudentProfile( id: string,
         data: Partial<IStudentProfile>
    ): Promise<IStudentProfile | null> {
        return await studentProfileRepository.update(id, data);
    }

    // Delete a student profile
    async deleteStudentProfile(
        id: string
    ): Promise<IStudentProfile | null> {
        return await studentProfileRepository.delete(id);
    }
}

export default new StudentProfileService();