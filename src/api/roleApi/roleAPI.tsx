import axiosClient from "../axiosClient";

class RoleAPI {
  static getAll(params = {}) {
    return axiosClient.get("/roles/", { params });
  }
}

export default RoleAPI;
