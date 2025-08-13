import axiosClient from "../axiosClient";

class JobsAPI {
  static getAll(params = {}) {
    return axiosClient.get("/jobs/", {params: {status: "Active", ...params,       
      },
    });
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
    return axiosClient.patch(`/jobs/${id}`, payload);
  }

  static Archivedjobs(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    return axiosClient.get(`/jobs`, { params });
  }

  static UnArchiveJob(id: string) {
    return axiosClient.patch(`/jobs/${id}`, { status: "Active" });
  }

  static UpdateApplicantStatusById(id: string, payload: any){
    return axiosClient.patch(`/applications/${id}`, payload);
  }

  static SendAssessmentForm(id: string, payload: any){
    return axiosClient.post(`/applications/${id}/send-assessment-candidate`, payload);
  }

  static SendEvaluationForm(id: string, payload: any){
    return axiosClient.post(`/applications/${id}/send-assessment-interviewers`, payload);
  }
}

export default JobsAPI;
