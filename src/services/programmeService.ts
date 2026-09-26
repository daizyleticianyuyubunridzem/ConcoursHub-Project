import programmeRepository from "../repositories/programmeRepository";
import { IProgramme } from "../models/programmeModel";

class ProgrammeService {

    // Get all programmes
    async getAllProgrammes(): Promise<IProgramme[]> {
        return await programmeRepository.findAll();
    }

    // Get one programme by its ID
    async getProgrammeById(
        id: string
    ): Promise<IProgramme | null> {
        return await programmeRepository.findById(id);
    }

    // Create a new programme
    async createProgramme(
        data: Partial<IProgramme>
    ): Promise<IProgramme> {
        return await programmeRepository.create(data);
    }

    // Update a programme
    async updateProgramme(
        id: string,
        data: Partial<IProgramme>
    ): Promise<IProgramme | null> {
        return await programmeRepository.update(id, data);
    }

    // Delete a programme
    async deleteProgramme(
        id: string
    ): Promise<IProgramme | null> {
        return await programmeRepository.delete(id);
    }
}

// Export one ProgrammeService instance for the Controller
export default new ProgrammeService();