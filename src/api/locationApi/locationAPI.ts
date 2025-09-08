import axiosClient from '../axiosClient';

class locationAPI {
  static Createlocation(data: {name: string; email: string; designation:string;}){
    return axiosClient.post('/countries', data);
  }

  static Updatelocation(id: string, data: { code: string; name: string; }) {
    return axiosClient.patch(`/interviewers/${id}`, data);
  }

  static getAll(params = {}) {
    return axiosClient.get("/countries", { params });
  }

  static Deletelocation(id: string) {
    return axiosClient.delete(`/countries/${id}`);
  }
}

export default locationAPI;
