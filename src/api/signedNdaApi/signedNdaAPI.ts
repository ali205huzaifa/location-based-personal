import axiosClient from '../axiosClient';

class signedNdaAPI {
  static CreateNDA(data: { fileUrl: string; }){
    return axiosClient.post('/ndaDoc', data);
  }

  static UpdateNDA(id: string, data: { fileUrl: string; }) {
    return axiosClient.patch(`/ndaDoc/${id}`, data);
  }

  static getAll(params = {}) {
    return axiosClient.get("/ndaDoc", { params });
  }

  static DeleteNDA(id: string) {
    return axiosClient.delete(`/ndaDoc/${id}`);
  }

    static GetUploadUrl(data: { name: string; fileType: string; type: string }) {
    return axiosClient.post("/ndaDoc/upload-media", data);
  }
}

export default signedNdaAPI;
