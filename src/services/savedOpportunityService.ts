import mongoose from "mongoose";

import savedOpportunityRepository from "../repositories/savedOpportunityRepository";
import { ISavedOpportunity } from "../models/savedOpportunityModel";

class SavedOpportunityService {

    // Get all opportunities saved by the currently logged-in user
    async getAllSavedOpportunities(
        userId: string
    ): Promise<ISavedOpportunity[]> {

        return await savedOpportunityRepository.findByUserId(userId);
    }

    // Get one saved opportunity only if it belongs to the logged-in user
    async getSavedOpportunityById(
        userId: string,
        id: string
    ): Promise<ISavedOpportunity | null> {

        const savedOpportunity =
            await savedOpportunityRepository.findById(id);

        if (!savedOpportunity) {
            return null;
        }

        if (savedOpportunity.user.toString() !== userId) {
            return null;
        }

        return savedOpportunity;
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
                "This opportunity has already been saved."
            );
        }

        const userObjectId =
            new mongoose.Types.ObjectId(userId);

        const opportunityObjectId =
            new mongoose.Types.ObjectId(opportunityId);

        return await savedOpportunityRepository.create({
            user: userObjectId,
            admissionOpportunity: opportunityObjectId,
        });
    }

    // Remove a saved opportunity only if it belongs to the logged-in user
    async removeSavedOpportunity(
        userId: string,
        id: string
    ): Promise<ISavedOpportunity | null> {

        const savedOpportunity =
            await savedOpportunityRepository.findById(id);

        if (!savedOpportunity) {
            return null;
        }

        if (savedOpportunity.user.toString() !== userId) {
            throw new Error(
                "You do not have permission to remove this saved opportunity."
            );
        }

        return await savedOpportunityRepository.delete(id);
    }
}

export default new SavedOpportunityService();