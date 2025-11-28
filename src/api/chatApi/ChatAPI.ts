import axiosClient from "../axiosClient";

class ChatAPI {
  static getMyContacts(params = {}) {
    return axiosClient.get("/contacts/mutual", { params });
  }

  static getMyChats() {
    return axiosClient.get("/chat/");
  }

  static getMessagesbyChatId(chatId: string) {
    return axiosClient.get(`/chat/${chatId}/messages`);
  }

  static OnetoOneChat(data = {}) {
    return axiosClient.post("/chat/direct", data);
  }

  static createGroup(data = {}) {
    return axiosClient.post("/chat/group", data);
  }
}

export default ChatAPI;
