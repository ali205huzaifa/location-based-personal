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
}

export default CandidatesAPI;
