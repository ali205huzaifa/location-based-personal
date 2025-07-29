import axiosClient from '../axiosClient';

class UsersAPI {
  static signup(data: {name: string; email: string; password:string; role: string}){
    return axiosClient.post('/auth/signup', data);
  }

  static UpdateUser(id: string, data: { name: string; email: string; role: string }) {
    return axiosClient.patch(`/users/${id}`, data);
  }

  static getAll(params = {}) {
    return axiosClient.get("/users/", { params });
  }

  static DeleteUser(id: string) {
    return axiosClient.delete(`/users/${id}`);
  }
}

export default UsersAPI;
