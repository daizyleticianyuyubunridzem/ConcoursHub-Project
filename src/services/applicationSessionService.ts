import applicationSessionRepository from "../repositories/applicationSessionRepository";
import { IApplicationSession } from "../models/applicationSessionModel";

class ApplicationSessionService {

    //get all appliccation sessions
    async getAllApplicationSessions(): Promise<IApplicationSession[]> {
        return await applicationSessionRepository.findAll();
    }
    //find one application session
    async getApplicationSessionById(
        id: string
    ): Promise<IApplicationSession | null> {
        return await applicationSessionRepository.findById(id);
    }
//create an applicationsession
    async createApplicationSession(
        data: Partial<IApplicationSession>
    ): Promise<IApplicationSession> {
        return await applicationSessionRepository.create(data);
    }

    //update an existing application session
    async updateApplicationSession(
        id: string,
        data: Partial<IApplicationSession>
    ): Promise<IApplicationSession | null> {
        return await applicationSessionRepository.update(id, data);
    }

    //delete an application-session
    async deleteApplicationSession(
        id: string
    ): Promise<IApplicationSession | null> {
        return await applicationSessionRepository.delete(id);
    }
}

export default new ApplicationSessionService();