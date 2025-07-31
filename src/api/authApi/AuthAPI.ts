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
}

export default AuthAPI;
