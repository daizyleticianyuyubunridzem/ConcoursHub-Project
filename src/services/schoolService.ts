import schoolRepository from "../repositories/schoolRepository";
import { ISchool } from "../models/schoolModel";

class SchoolService {
    async getAllSchools(): Promise<ISchool[]> {
        return await schoolRepository.findAll();
    }

    async getSchoolById(id: string): Promise<ISchool | null> {
        return await schoolRepository.findById(id);
    }

    async createSchool(
        data: Partial<ISchool>
    ): Promise<ISchool> {
        return await schoolRepository.create(data);
    }

    async updateSchool(
        id: string,
        data: Partial<ISchool>
    ): Promise<ISchool | null> {
        return await schoolRepository.update(id, data);
    }

    async deleteSchool(
        id: string
    ): Promise<ISchool | null> {
        return await schoolRepository.delete(id);
    }
}

export default new SchoolService();