import Requirement, { IRequirement } from "../models/requirementModel";

class RequirementRepository {

    //get all requirements
    async findAll(): Promise<IRequirement[]> {
        return await Requirement.find();
    }

    //get one requirement
    async findById(
        id: string
    ): Promise<IRequirement | null> {
        return await Requirement.findById(id);
    }

    //creat a new requirement
    async create(
        data: Partial<IRequirement>
    ): Promise<IRequirement> {
        return await Requirement.create(data);
    }

    //update a requirement
    async update(
        id: string,
        data: Partial<IRequirement>
    ): Promise<IRequirement | null> {
        return await Requirement.findByIdAndUpdate(
            id,
            data,
            {    
                new: true,
                runValidators: true,
            }
        );
    }

    // Delete a requirement
    async delete(
        id: string
    ): Promise<IRequirement | null> {
        return await Requirement.findByIdAndDelete(id);
    }
}

export default new RequirementRepository();