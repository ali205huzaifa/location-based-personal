import axiosClient from "../axiosClient";

class PostAPI {
  static getPublicPosts() {
    return axiosClient.get("/post");
  }

  static getPublicPostsByUser(id: string, params = {}) {
    return axiosClient.get(`/post/user/${id}`, { params });
  }

  static getMyInteractions(params = {}) {
    return axiosClient.get("/interactions/", { params });
  }

  static getMyContacts() {
    return axiosClient.get("/contacts/granted");
  }
}

export default PostAPI;
