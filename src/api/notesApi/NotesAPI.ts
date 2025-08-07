import axiosClient from '../axiosClient';

interface GetAllParams {
  userId: string;
}

class NoteAPI {
  static CreateNote(data: any) {
    return axiosClient.post('/notes/', data);
  }

  static UpdateNote(id: string, data: any) {
    return axiosClient.patch(`/notes/${id}`, data);
  }

  static getAll(params: GetAllParams) {
    return axiosClient.get('/notes', { params });
  }

  static GetNoteById(id: string) {
    return axiosClient.get(`/notes/${id}`);
  }

  static DeleteNote(id: string) {
    return axiosClient.delete(`/notes/${id}`);
  }

  static getAllStats(params = {}) {
    return axiosClient.get("/stats", { params });
  }
}

export default NoteAPI;
