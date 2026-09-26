import School, { ISchool } from "../models/schoolModel";

class SchoolRepository {
    async findAll(): Promise<ISchool[]> {
        return await School.find();
    }

    async findById(id: string): Promise<ISchool | null> {
        return await School.findById(id);
    }

    async create(data: Partial<ISchool>): Promise<ISchool> {
        return await School.create(data);
    }

    async update(
        id: string,
        data: Partial<ISchool>
    ): Promise<ISchool | null> {
        return await School.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async delete(id: string): Promise<ISchool | null> {
        return await School.findByIdAndDelete(id);
    }
}

export default new SchoolRepository();