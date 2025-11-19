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

  static searchUsers(params = {}) {
    return axiosClient.get("/search", { params });
  }

  static getCommentforPost(id: string) {
    return axiosClient.get(`/comments/${id}`);
  }

  static likePost(id: string) {
    return axiosClient.post(`/interactions/toggle/${id}`);
  }

  static getPostInteractionsById(id: string) {
    return axiosClient.get(`/interactions/count/${id}`);
  }

  static commentOnPost(id: string, payload: any) {
    return axiosClient.post(`/comments/post/${id}`, payload);
  }

  static reportPost(payload: any) {
    return axiosClient.post("/content-moderation/user-report", payload);
  }

  static addToContact(payload: any) {
    return axiosClient.post("/contacts/add", payload);
  }

  static checkRelation(id: string) {
    return axiosClient.get(`/contacts/relationships/${id}`);
  }
}

export default PostAPI;
