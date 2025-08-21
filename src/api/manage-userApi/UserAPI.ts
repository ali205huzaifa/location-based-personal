import axiosClient from '../axiosClient';

class UsersAPI {
  static signup(data: {name: string; email: string; password:string; role: string}){
    return axiosClient.post('/auth/signup', data);
  }

  static getAll(params = {}) {
    return axiosClient.get("/users/", { params });
  }

  static UpdateUser(id: string, data: { name: string; email: string; role: string;}) {
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

  static UpdateProfileImage(id: string, data: {profilePicture?: string }) {
    return axiosClient.patch(`/users/${id}`, data);
  }

  static getUsersByRole(roleId: string) {
    return axiosClient.get(`/users?role=${roleId}`);
  }

}

export default UsersAPI;
