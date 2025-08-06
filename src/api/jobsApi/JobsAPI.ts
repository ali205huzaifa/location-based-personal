import axiosClient from "../axiosClient";

class JobsAPI {
  static getAll(params = {}) {
    return axiosClient.get("/jobs/", { params });
  }

  static getById(id: string) {
    return axiosClient.get(`/jobs/${id}`);
  }

  static getAllApplications() {
    return axiosClient.get(`/applications`);
  }

  static AddComment(id: string, payload: { text: string }) {
    return axiosClient.post(`/applications/${id}/comments`, payload);
  }
  
  static getApplicationById(id: string){
    return axiosClient.get(`/applications/${id}`);
  }

  static AddJob(payload: any){
    return axiosClient.post(`/jobs/`, payload);
  }

  static UpdateJobById(id: string, payload: any){
    return axiosClient.post(`/jobs/${id}`, payload);
  }
}

export default JobsAPI;
