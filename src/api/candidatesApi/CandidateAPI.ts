import axiosClient from "../axiosClient";

class CandidatesAPI {
  static getAll(params = {}) {
    return axiosClient.get("/applications/", { params });
  }
}

export default CandidatesAPI;
