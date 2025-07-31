import axiosClient from "../axiosClient";

class JobsAPI {
  static getAll(params = {}) {
    return axiosClient.get("/applications/", { params });
  }
}

export default JobsAPI;
