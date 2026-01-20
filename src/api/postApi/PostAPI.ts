import axiosClient from "../axiosClient";

class PostAPI {
  static getPublicPosts(params = {}) {
    return axiosClient.get("/post", { params });
  }

  static getPostsByMapArea(params = {}) {
    return axiosClient.get("/post/map-area", { params });
  }

  static getPublicPostsByUser(id: string, params = {}) {
    return axiosClient.get(`/post/user/${id}`, { params });
  }

  static getPublicPrivateProfile(id: string, params = {}) {
    return axiosClient.get(`/user/profile/${id}`, { params });
  }

  static getInteractions(id: string, params = {}) {
    return axiosClient.get(`/interactions/target/${id}`, { params });
  }

  static getMyContacts() {
    return axiosClient.get("/contacts/granted");
  }

  static searchShareContacts(params = {}) {
    return axiosClient.get("/contacts/search", { params });
  }

  static searchUsers(params = {}) {
    return axiosClient.get("/search/users", { params });
  }

  static getCommentforPost(id: string) {
    return axiosClient.get(`/comments/${id}`);
  }

  static likePost(id: string) {
    return axiosClient.post(`/interactions/toggle/${id}`);
  }

  static getPostInteractionsById(id: string) {
    return axiosClient.get(`/interactions/post/like/${id}`);
  }

  static getPostById(id: string) {
    return axiosClient.get(`/post/${id}`);
  }

  static updatePostById(id: string, payload: any) {
    return axiosClient.patch(`/post/${id}`, payload);
  }

  static deletePostById(id: string) {
    return axiosClient.delete(`/post/${id}`);
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

  static RemoveContact(id: string) {
    return axiosClient.delete(`/contacts/${id}`);
  }

  static getNotifications(params = {}) {
    return axiosClient.get("/notification", { params });
  }

  static markRead(id: string, params = {}) {
    return axiosClient.patch(`/notification/${id}/read`, {
      params,
    });
  }

  static markAllasRead(params = {}) {
    return axiosClient.patch("notification/mark-all/read", {
      params,
    });
  }
}

export default PostAPI;
