import axiosClient from '../axiosClient';

class AuthAPI {
  static logIn(data: { email: string; password: string }) {
    return axiosClient.post('/auth/login', data);
  }

  static verifyToken(token: string) {
    return axiosClient.get('/auth/verify-token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static changePassword(data: { currentPassword: string; newPassword: string; confirmNewPassword: string;}) {
    return axiosClient.patch('/auth/update-password', data);
  }
}

export default AuthAPI;
