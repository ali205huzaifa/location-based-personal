import axiosClient from "../axiosClient";

class PostAPI {
  static getPublicPosts() {
    return axiosClient.get("/post");
  }

  static getMyContacts() {
    return axiosClient.get("/contacts/granted");
  }
}

export default PostAPI;
