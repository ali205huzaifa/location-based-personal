import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { setAuthData, clearAuthData } from "../../store/Auth";
import { Form, Input, Button, Avatar, message } from "antd";
import ProfileAPI from "../../api/profileApi/ProfileAPI";
import AddPostAPI from "../../api/addPostApi/AddPostAPI";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import AuthAPI from "../../api/authApi/AuthAPI";

const { TextArea } = Input;

const EditProfile: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string>(
    "/images/default-chat-profile.svg"
  );

  const { currentUser, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        fullName: currentUser.fullName || "",
        username: currentUser.username || "",
        email: currentUser.email || "",
        bio: currentUser.bio || "",
        image: currentUser.image || "/images/default-chat-profile.svg",
      });
      setImage(currentUser.image || "/images/default-chat-profile.svg");
    }
  }, [currentUser, form]);

  const handleSaveChanges = async () => {
    if (!token) {
      message.error("User not authenticated!");
      return;
    }

    try {
      const values = await form.validateFields();
      const payload = {
        fullName: values.fullName,
        username: values.username,
        bio: values.bio,
        image: values.image,
      };

      await ProfileAPI.UpdateProfileInfo(payload, token);
      message.success("Profile updated successfully!");

      if (!currentUser) {
        message.error("User data not available");
        return;
      }

      dispatch(
        setAuthData({
          currentUser: {
            ...currentUser,
            ...payload,
            _id: currentUser._id,
          },
          token,
        })
      );
    } catch (error: any) {
      console.error("Error updating profile:", error);
      message.error(
        error?.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!token) {
      message.error("User not authenticated!");
      return;
    }

    try {
      message.loading({ content: "Uploading image...", key: "upload" });

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await AddPostAPI.uploadMedia(file);
      const imageUrl = uploadResponse?.data?.url;

      if (imageUrl) {
        form.setFieldValue("image", imageUrl);
        setImage(imageUrl);
        message.success({
          content: "Image uploaded successfully!",
          key: "upload",
        });
      } else {
        throw new Error("Invalid upload response");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      message.error({ content: "Failed to upload image!", key: "upload" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) {
      message.error("User not authenticated!");
      return;
    }

    try {
      setDeleteLoading(true);
      await AuthAPI.deleteAccount();

      message.success("Account deleted successfully");
      dispatch(clearAuthData());

      navigate("/");
    } catch (error: any) {
      console.error("Delete account error:", error);
      message.error(
        error?.response?.data?.message || "Failed to delete account"
      );
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-black text-2xl font-medium mb-2">Edit Profile</h2>
          <p className="text-[#666666] text-sm font-normal">
            Update your name, bio, and profile photo to keep your account fresh
            and personal.
          </p>
        </div>

        <div
          className="cursor-pointer mr-8"
          onClick={() => setDeleteModalOpen(true)}
        >
          <img
            src="/icons/delete-icon.svg"
            alt="Icon"
            className="w-[23px] h-[24px]"
          />
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        className="space-y-6 w-full pr-8"
        initialValues={{
          fullName: "",
          username: "",
          email: "",
          bio: "",
          image: "https://i.pravatar.cc/150?img=32",
        }}
      >
        <div className="mb-4">
          <div className="text-[#000000] text-sm font-normal mb-3">
            Display Image
          </div>

          <div className="flex items-center space-x-12 w-full">
            <div className="relative">
              <Avatar size={80} src={image} className="border-none" />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 absolute bottom-0 right-0 bg-[#8869F3] text-white p-1 rounded-full shadow-lg cursor-pointer"
              >
                <img
                  src="/icons/image-edit-icon.svg"
                  alt="Icon"
                  className="w-6 h-6 text-sm p-1"
                />
              </button>
            </div>

            <div className="flex items-center bg-white rounded-xl px-4 py-3 space-x-3 flex-1">
              <img
                src="/icons/location-icon.svg"
                alt="location"
                className="w-5 h-5"
              />
              <div>
                <p className="text-black text-base font-normal">
                  {currentUser?.location || "unknown"}
                </p>
                <p className="text-[#666666] text-xs font-normal">
                  Current Location
                </p>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>
        </div>

        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input
            className="h-12 rounded-xl border-gray-300 text-[#000000] text-sm font-normal bg-[#FFFFFF] focus:!border-[#8869F3] hover:!border-[#8869F3]"
            placeholder="Enter full name"
          />
        </Form.Item>

        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please choose a username" }]}
        >
          <Input
            className="h-12 rounded-xl border-gray-300 text-[#000000] text-sm font-normal bg-[#FFFFFF] focus:!border-[#8869F3] hover:!border-[#8869F3]"
            placeholder="Choose a username"
          />
        </Form.Item>

        <Form.Item name="email" label="Email">
          <Input
            disabled
            className="h-12 rounded-xl border-gray-300 text-[#000000] text-sm font-normal bg-[#E8E6E6] cursor-not-allowed"
          />
        </Form.Item>

        <Form.Item
          name="bio"
          label="Bio"
          rules={[{ max: 100, message: "Bio cannot exceed 100 characters" }]}
        >
          <TextArea
            rows={2}
            maxLength={100}
            showCount
            autoSize={false}
            className="rounded-xl border-gray-300 text-[#000000] text-sm font-normal bg-[#FFFFFF] focus:!border-[#8869F3] hover:!border-[#8869F3] resize-none"
            placeholder="Tell us about yourself..."
          />
        </Form.Item>

        <Form.Item hidden name="image">
          <Input />
        </Form.Item>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSaveChanges}
            className="!w-36 !h-12 sm:w-auto px-8 !bg-[#8869F3] border-none !text-white text-sm font-normal"
          >
            Save Changes
          </Button>
        </div>
      </Form>

      <Modal
        title="Delete Account"
        centered
        open={deleteModalOpen}
        footer={null}
        onCancel={() => setDeleteModalOpen(false)}
      >
        <div className="text-center py-4">
          <p className="text-lg font-medium mb-6">
            Are you sure you want to delete your account permanently?
          </p>

          <div className="flex justify-center gap-4">
            <Button
              type="primary"
              danger
              loading={deleteLoading}
              onClick={handleDeleteAccount}
              className="!bg-[#FF5D5D]"
            >
              Yes, Delete
            </Button>

            <Button
              onClick={() => setDeleteModalOpen(false)}
              className="!border-[#666666] !text-[#666666]"
            >
              No
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditProfile;
