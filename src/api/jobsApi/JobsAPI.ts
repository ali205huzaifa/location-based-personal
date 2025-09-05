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

  static getApplicationsByJob(jobId: string) {
    return axiosClient.get(`/applications`, {
      params: { jobId },
    });
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

  static UpdateInterviewerInApplicationById(id: string, payload: any){
    return axiosClient.patch(`/applications/${id}`, payload);
  }

  static SendAssessmentForm(id: string, payload: any){
    return axiosClient.post(`/applications/${id}/send-assessment-candidate`, payload);
  }

  static SendAssessmentFormDate(id: string, payload: any){
    return axiosClient.patch(`/applications/${id}`, payload);
  }

  static SendEvaluationForm(id: string, payload: any){
    return axiosClient.post(`/applications/${id}/send-assessment-interviewers`, payload);
  }

  static SendCandidateEmail(
    id: string,
    data: {
      email: string;
      emailType: string;
      interviewerIds: string[];
      interviewDate: string;
      interviewTime: string;
      body: string;
    }
  ) {
    return axiosClient.post(`/applications/${id}/send-email`, data);
  }

  static readUnreadCount(jobId: string) {
    return axiosClient.get(`/applications/read-unread-count`, { params: { jobId } });
  }

  static UpdateUnreadCountByJobId(applicationId: string, payload: any){
    return axiosClient.patch(`/applications/${applicationId}`, payload);
  }
}

export default JobsAPI;
