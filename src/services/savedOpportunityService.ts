import mongoose from "mongoose";

import savedOpportunityRepository from "../repositories/savedOpportunityRepository";
import { ISavedOpportunity } from "../models/savedOpportunityModel";

class SavedOpportunityService {

    // Get all opportunities saved
    async getAllSavedOpportunities(): Promise<ISavedOpportunity[]> {
        return await savedOpportunityRepository.findAll();
    }

    async getSavedOpportunityById(
        id: string
    ): Promise<ISavedOpportunity | null> {
        return await savedOpportunityRepository.findById(id);
    }

    // Get all opportunities saved by a specific user
    async getSavedOpportunitiesByUser(
        userId: string
    ): Promise<ISavedOpportunity[]> {
        return await savedOpportunityRepository.findByUserId(userId);
    }

    // Save an admission opportunity for a user
    async saveOpportunity(
        userId: string,
        opportunityId: string
    ): Promise<ISavedOpportunity> {

        const existingSave =
            await savedOpportunityRepository.findByUserAndOpportunity(
                userId,
                opportunityId
            );

        if (existingSave) {
            throw new Error(
                "This opportunity has already been saved"
            );
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const opportunityObjectId =
            new mongoose.Types.ObjectId(opportunityId);

        // Create the saved opportunity 
        return await savedOpportunityRepository.create({
            user: userObjectId,
            admissionOpportunity: opportunityObjectId,
        });
    }

    // Remove a saved opportunity
    async removeSavedOpportunity(
        id: string
    ): Promise<ISavedOpportunity | null> {
        return await savedOpportunityRepository.delete(id);
    }
}

export default new SavedOpportunityService();

