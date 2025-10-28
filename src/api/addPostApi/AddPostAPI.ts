import axiosClient from "../axiosClient";

class AddPostAPI {
  static async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/media/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  static async createPost(data: {
    content: string;
    media: { url: string; type: string }[];
    visibility: "public" | "private";
    location: { type: string; coordinates: number[] };
  }) {
    return axiosClient.post("/post/create", data);
  }
}

export default AddPostAPI;
