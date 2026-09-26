import Programme, { IProgramme } from "../models/programmeModel";

class ProgrammeRepository {

    async findAll(): Promise<IProgramme[]> {
        return await Programme.find();
    }

    async findById(id: string): Promise<IProgramme | null> {
        return await Programme.findById(id);
    }

    async create(data: Partial<IProgramme>): Promise<IProgramme> {
        return await Programme.create(data);
    }

    async update(
        id: string,
        data: Partial<IProgramme>
    ): Promise<IProgramme | null> {
        return await Programme.findByIdAndUpdate(
            id,
            data,
            {
            
                new: true,
                runValidators: true,
            }
        );
    }

   
    async delete(id: string): Promise<IProgramme | null> {
        return await Programme.findByIdAndDelete(id);
    }
}

// Export one repository instance for use by the Service layer
export default new ProgrammeRepository();