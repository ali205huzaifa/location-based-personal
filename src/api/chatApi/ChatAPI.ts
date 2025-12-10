import axiosClient from "../axiosClient";

class ChatAPI {
  static getMyContacts(params = {}) {
    return axiosClient.get("/contacts/mutual", { params });
  }

  static getMyChats() {
    return axiosClient.get("/chat/");
  }

  static getMessagesbyChatId(chatId: string, params = {}) {
    return axiosClient.get(`/chat/${chatId}/messages`, { params });
  }

  static OnetoOneChat(data = {}) {
    return axiosClient.post("/chat/direct", data);
  }

  static createGroup(data = {}) {
    return axiosClient.post("/chat/group", data);
  }

  static getSearchedCotacts(params = {}) {
    return axiosClient.get("/chat/search", { params });
  }
}

export default ChatAPI;
