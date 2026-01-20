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

  static leaveGroupChat(chatId: string) {
    return axiosClient.post(`/chat/group/${chatId}/leave`);
  }

  static deleteGroupChat(chatId: string) {
    return axiosClient.delete(`/chat/group/${chatId}`);
  }

  static removeGroupMember(chatId: string, memberId: string) {
    return axiosClient.post(`/chat/${chatId}/remove-member`, {
      memberId,
    });
  }

  static makeGroupAdmin(chatId: string, memberId: string) {
    return axiosClient.post(`/chat/group/${chatId}/make-admin`, {
      memberId,
    });
  }

  static AddGroupMembers(chatId: string, memberIds: string[]) {
    return axiosClient.post(`/chat/group/${chatId}/add-member`, {
      memberIds,
    });
  }

  static editGroupChatInfo(chatId: string, payload: any) {
    return axiosClient.patch(`/chat/group/${chatId}`, payload);
  }

  static sharePostWithUser(data: {
    participants: string[] | number[];
    postLink: string;
  }) {
    return axiosClient.post("/chat/direct/share", data);
  }
}

export default ChatAPI;
