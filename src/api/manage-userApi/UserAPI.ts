import axiosClient from '../axiosClient';

class UsersAPI {
  static signup(data: {name: string; email: string; password:string; role: string}){
    return axiosClient.post('/auth/signup', data);
  }

  static getAll(params = {}) {
    return axiosClient.get("/users/", { params });
  }

  static UpdateUser(id: string, data: { name: string; email: string; role: string; profileImage?: string }) {
    return axiosClient.patch(`/users/${id}`, data);
  }

  static DeleteUser(id: string) {
    return axiosClient.delete(`/users/${id}`);
  }

  static changePassword(data: { currentPassword: string; newPassword: string; confirmNewPassword: string;}) {
    return axiosClient.patch('/users/update-password', data);
  }

  static ImageUrl(data: {name: string; fileType: string; type:string}) {
    return axiosClient.post("/users/upload-media", data);
  }
}

export default UsersAPI;
