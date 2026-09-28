import AdmissionOpportunityRepository from "../repositories/admissionOpportunityRepository";
import { IAdmissionOpportunity } from "../models/admissionOpportunityModel";

class AdmissionOpportunityService {

    // Get all admission opportunities
    async getAllAdmissionOpportunities(): Promise<IAdmissionOpportunity[]> {
        return await AdmissionOpportunityRepository.findAll();
    }

    // Get one admission opportunity by its ID
    async getAdmissionOpportunityById(
        id: string
    ): Promise<IAdmissionOpportunity | null> {
        return await AdmissionOpportunityRepository.findById(id);
    }

    // Create a new admission opportunity
    async createAdmissionOpportunity(
        data: Partial<IAdmissionOpportunity>
    ): Promise<IAdmissionOpportunity> {
        return await AdmissionOpportunityRepository.create(data);
    }

    // Update an existing admission opportunity
    async updateAdmissionOpportunity(
        id: string,
        data: Partial<IAdmissionOpportunity>
    ): Promise<IAdmissionOpportunity | null> {
        return await AdmissionOpportunityRepository.update(id, data);
    }

    // delete an admission opportunity
    async deleteAdmissionOpportunity(
        id: string
    ): Promise<IAdmissionOpportunity | null> {
        return await AdmissionOpportunityRepository.delete(id);
    }
}


export default new AdmissionOpportunityService();