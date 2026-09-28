import AdmissionOpportunity, {IAdmissionOpportunity } from "../models/admissionOpportunityModel";

class AdmissionOpportunityRepository {

    async findAll(): Promise<IAdmissionOpportunity[]> {
        return await AdmissionOpportunity.find();
    }

    async findById(
        id: string
    ): Promise<IAdmissionOpportunity | null> {
        return await AdmissionOpportunity.findById(id);
    }

    async create(data: Partial<IAdmissionOpportunity>):
     Promise<IAdmissionOpportunity> {
        return await AdmissionOpportunity.create(data);
    }

    async update( id: string, data: Partial<IAdmissionOpportunity>
    ): Promise<IAdmissionOpportunity | null> {
        return await AdmissionOpportunity.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async delete(
        id: string
    ): Promise<IAdmissionOpportunity | null> {
        return await AdmissionOpportunity.findByIdAndDelete(id);
    }
}


export default new AdmissionOpportunityRepository();