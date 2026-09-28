import requirementRepository from "../repositories/requirementRepository";
import { IRequirement } from "../models/requirementModel";

class RequirementService {

    async getAllRequirements(): Promise<IRequirement[]> {
        return await requirementRepository.findAll();
    }

    async getRequirementById(
        id: string
    ): Promise<IRequirement | null> {
        return await requirementRepository.findById(id);
    }

    async createRequirement(
        data: Partial<IRequirement>
    ): Promise<IRequirement> {
        return await requirementRepository.create(data);
    }

    async updateRequirement(
        id: string,
        data: Partial<IRequirement>
    ): Promise<IRequirement | null> {
        return await requirementRepository.update(id, data);
    }

    async deleteRequirement(
        id: string
    ): Promise<IRequirement | null> {
        return await requirementRepository.delete(id);
    }
}


export default new RequirementService();