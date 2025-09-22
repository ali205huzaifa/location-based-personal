import axiosClient from "../axiosClient";

class CandidatesAPI {
  static getAll(params = {}) {
    return axiosClient.get("/applications", { params });
  }
  
  static fetchTitles() {
    return axiosClient.get("/jobs/titles");
  }

  static titleFilter(params = {}) {
    return axiosClient.get("/jobs", { params });
  }

  static SendNDAForm(id: string) {
    return axiosClient.post(`/candidates/${id}/send-nda-form`);
  }

  static SubmitNDAForm(id: string, payload: any) {
    return axiosClient.patch(`/candidates/${id}`, payload);
  }
}

export default CandidatesAPI;
