import axiosClient from '../axiosClient'; 

class deptSkillsAPI{ 
    static Createdept(data: { name: string; description: string; }) { 
        return axiosClient.post('/departments', data); 
    } 

    static Updatedept(id: string, data: { name: string; description: string; }) { 
        return axiosClient.patch(`/departments/${id}`, data); 
    } 

    static getAlldept(params = {}) { 
        return axiosClient.get("/departments", { params }); 
    } 

    static getDepartmentById(id: string) {
        return axiosClient.get(`/departments/${id}`);
    }

    static Deletedept(id: string) { 
        return axiosClient.delete(`/departments/${id}`); 
    } 

    static Createskills(data: { departmentId: string; name: string; }) { 
        return axiosClient.post('/skills', data); 
    } 

    static Updateskills(id: string, data: { departmentId: string; name: string; }) { 
        return axiosClient.patch(`/skills/${id}`, data); 
    } 

    static getAllskills(params = {}) { 
        return axiosClient.get("/skills", { params }); 
    } 
    
    static Deleteskills(id: string) { 
        return axiosClient.delete(`/skills/${id}`); 
    } 
} 
export default deptSkillsAPI;