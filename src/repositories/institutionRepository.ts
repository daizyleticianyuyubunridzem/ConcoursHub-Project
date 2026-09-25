import Institution , {IInstitution} from "../models/Institution";


class InstitutionRepository {
    async findAll(): Promise<IInstitution[]>{
        return await Institution.find();
    }

    async findById(id: string): Promise<IInstitution | null>{
        return await Institution.findById(id);
    }

    async create ( data: Partial<IInstitution>): Promise<IInstitution |null>{
        return await Institution.create(data);
    }

    async update (id: string,
        data: Partial<IInstitution>
    ): Promise<IInstitution | null>{
        return await Institution.findByIdAndUpdate(id, 
            data,
            {
                new: true,
                runValidators: true
            }
        );
    }

    async delete(id: string): Promise<IInstitution | null>{
        return await Institution.findByIdAndDelete(id)
    }
};

export default new InstitutionRepository();