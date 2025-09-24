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

  static SendOTP(data: { email: string; }) {
    return axiosClient.post('/auth/forgot-password', data);
  }

  static VerifyOTP (data: { otp: number; }) {
    return axiosClient.post('/auth/verify-password-otp', data);
  }

  static ResetPassword  (data: { email: string; newPassword: string; otp: number; }) {
    return axiosClient.post('/auth/reset-password', data);
  }
}

export default AuthAPI;
