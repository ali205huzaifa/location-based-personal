import axiosClient from "../axiosClient";

class ChatAPI {
  static getMyContacts() {
    const token = localStorage.getItem("token");
    return axiosClient.get("/contacts/mutual", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static getMyChats() {
    const token = localStorage.getItem("token");
    return axiosClient.get("/chat/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static getMessagesbyChatId(chatId: string) {
    return axiosClient.get(`/chat/${chatId}/messages`);
  }

  static OnetoOneChat(data = {}) {
    return axiosClient.post("/chat/direct", data);
  }

  static createGroup(data = {}) {
    return axiosClient.post("/chat", data);
  }
}

export default ChatAPI;
