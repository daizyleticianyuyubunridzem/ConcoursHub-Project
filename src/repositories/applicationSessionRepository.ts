import ApplicationSession, { IApplicationSession } from "../models/applicationSessionModel";

class ApplicationSessionRepository {

    // Get all application sessions 
    async findAll(): Promise<IApplicationSession[]> {
        return await ApplicationSession.find();
    }

    // Get one application session by its ID
    async findById(
        id: string
    ): Promise<IApplicationSession | null> {
        return await ApplicationSession.findById(id);
    }

    // Create a new application session
    async create(
        data: Partial<IApplicationSession>
    ): Promise<IApplicationSession> {
        return await ApplicationSession.create(data);
    }

    // Update an existing application session
    async update(
        id: string,
        data: Partial<IApplicationSession>
    ): Promise<IApplicationSession | null> {
        return await ApplicationSession.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    // Delete an application session
    async delete(
        id: string
    ): Promise<IApplicationSession | null> {
        return await ApplicationSession.findByIdAndDelete(id);
    }
}


export default new ApplicationSessionRepository();