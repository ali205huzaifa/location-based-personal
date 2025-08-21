import axiosClient from "../axiosClient";

class RoleAPI {
  static getAll(params = {}) {
    return axiosClient.get("/roles/", { params });
  }

  static AddRole(name: string, permissions: string[]) {
    return axiosClient.post("/roles/", { name, permissions });
  }

  static UpdateRole(id: string, data: { name: string; permissions: string[] }) {
    return axiosClient.patch(`/roles/${id}`, data);
  }

  static DeleteRole(id: string) {
    return axiosClient.delete(`/roles/${id}`);
  }

  static ForceDeleteRole(id: string) {
    return axiosClient.delete(`/roles/${id}?force=true`);
  }
}

export default RoleAPI;
