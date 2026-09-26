import institutionRepository from "../repositories/institutionRepository";
import { IInstitution } from "../models/institutionModel";

class InstitutionService {
    async getAllInstitutions(): Promise<IInstitution[]>{
        return await institutionRepository.findAll();
    }

    async getInstitutionById(id: string): Promise<IInstitution | null>{
        return await institutionRepository.findById(id);
    }

    async createInstitution( data: Partial<IInstitution>): Promise<IInstitution |null>{
        return await institutionRepository.create(data);
    }

    async updateInstitution (id: string,
        data: Partial<IInstitution>
    ): Promise<IInstitution | null>{
        return await institutionRepository.update(id, data);
    }

    async deleteInstitution(id: string): Promise<IInstitution | null>{
        return await institutionRepository.delete(id)
    }
};

export default new InstitutionService();