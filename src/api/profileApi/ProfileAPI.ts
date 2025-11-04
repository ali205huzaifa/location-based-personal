import axiosClient from "../axiosClient";

const ProfileAPI = {
  UpdateProfileInfo(
    data: {
      fullName: string;
      username: string;
      bio: string;
      image: string;
    },
    token: string
  ) {
    return axiosClient.patch("/user/me", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/media/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  UpdateNotificationInfo(
    data: {
      notificationsEnabled: boolean;
    },
    token: string
  ) {
    return axiosClient.patch("/user/notifications", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  ChangePassword(
    data: {
      currentPassword: string;
      newPassword: string;
    },
    token: string
  ) {
    return axiosClient.patch("/user/me/password", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  UpdatePrivacy(
    data: {
      privacy: string;
    },
    token: string
  ) {
    return axiosClient.patch("/user/privacy", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  UpdateLanguage(
    data: {
      language: string;
    },
    token: string
  ) {
    return axiosClient.patch("/user/me/language", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default ProfileAPI;
