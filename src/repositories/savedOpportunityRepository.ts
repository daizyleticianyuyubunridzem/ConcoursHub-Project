import SavedOpportunity, {
    ISavedOpportunity
} from "../models/savedOpportunityModel";

class SavedOpportunityRepository {

    async findById(
        id: string
    ): Promise<ISavedOpportunity | null> {
        return await SavedOpportunity.findById(id);
    }

    async findByUserId(
        userId: string
    ): Promise<ISavedOpportunity[]> {
        return await SavedOpportunity.find({
            user: userId
        });
    }

    // Check whether a user has already saved an opportunity
    async findByUserAndOpportunity(
        userId: string,
        opportunityId: string
    ): Promise<ISavedOpportunity | null> {

        return await SavedOpportunity.findOne({
            user: userId,
            admissionOpportunity: opportunityId
        });
    }

    // Save an admission opportunity
    async create(
        data: Partial<ISavedOpportunity>
    ): Promise<ISavedOpportunity> {

        return await SavedOpportunity.create(data);
    }

    async delete(
        id: string
    ): Promise<ISavedOpportunity | null> {

        return await SavedOpportunity.findByIdAndDelete(id);
    }
}

export default new SavedOpportunityRepository();