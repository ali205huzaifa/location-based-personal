import axiosClient from '../axiosClient';

class InterviewerAPI {
  static CreateInterviewer(data: {name: string; email: string; designation:string;}){
    return axiosClient.post('/interviewers/', data);
  }

  static UpdateInterviewer(id: string, data: { name: string; email: string; designation:string; }) {
    return axiosClient.patch(`/interviewers/${id}`, data);
  }

  static getAll(params = {}) {
    return axiosClient.get("/interviewers/", { params });
  }

  static DeleteInterviewer(id: string) {
    return axiosClient.delete(`/interviewers/${id}`);
  }
}

export default InterviewerAPI;
