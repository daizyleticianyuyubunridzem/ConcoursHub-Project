import departmentRepository from "../repositories/departmentRepository";
import { IDepartment } from "../models/departmentModel";

class DepartmentService {

    // Get all departments
    async getAllDepartments(): Promise<IDepartment[]> {
        return await departmentRepository.findAll();
    }

    // Get one department by ID
    async getDepartmentById(
        id: string
    ): Promise<IDepartment | null> {
        return await departmentRepository.findById(id);
    }

    // Create a new department
    async createDepartment(
        data: Partial<IDepartment>
    ): Promise<IDepartment> {
        return await departmentRepository.create(data);
    }

    // Update an existing department
    async updateDepartment(
        id: string,
        data: Partial<IDepartment>
    ): Promise<IDepartment | null> {
        return await departmentRepository.update(id, data);
    }

    // Delete a department
    async deleteDepartment(
        id: string
    ): Promise<IDepartment | null> {
        return await departmentRepository.delete(id);
    }
}

// Export one DepartmentService instance for the Controller
export default new DepartmentService();