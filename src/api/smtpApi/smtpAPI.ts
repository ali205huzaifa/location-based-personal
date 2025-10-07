import axiosClient from '../axiosClient';

class SmtpAPI {
  static CreateSmtp(data: {provider: string; host: string; port:string; email:string; password:string; }){
    return axiosClient.post('/email-config', data);
  }

  static UpdateSmtp(id: string, data: { provider: string; host: string; port:string; email:string; password:string; }) {
    return axiosClient.patch(`/email-config/${id}`, data);
  }

  static getAll(params = {}) {
    return axiosClient.get("/email-config", { params });
  }

  static DeleteSmtp(id: string) {
    return axiosClient.delete(`/email-config/${id}`);
  }

  static SetSmtpDefault(id: string) {
    return axiosClient.patch(`/email-config/${id}`, { isDefault: true });
  }
}

export default SmtpAPI;
