import Department, { IDepartment } from "../models/departmentModel";

class DepartmentRepository {

    // Get all departments from MongoDB
    async findAll(): Promise<IDepartment[]> {
        return await Department.find();
    }

    // Get a single department using its ID
    async findById(id: string): Promise<IDepartment | null> {
        return await Department.findById(id);
    }

    // Create a new department in MongoDB
    async create(data: Partial<IDepartment>): Promise<IDepartment> {
        return await Department.create(data);
    }

    // Update an existing department
    async update(
        id: string,
        data: Partial<IDepartment>
    ): Promise<IDepartment | null> {
        return await Department.findByIdAndUpdate(
            id,
            data,
            {

                new: true,
                runValidators: true,
            }
        );
    }

    // Delete a department using its MongoDB ID
    async delete(id: string): Promise<IDepartment | null> {
        return await Department.findByIdAndDelete(id);
    }
}


export default new DepartmentRepository();