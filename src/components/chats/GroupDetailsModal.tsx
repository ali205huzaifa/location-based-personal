import React, { useState, useRef } from "react";
import { Modal, Avatar, Input, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ChatAPI from "../../api/chatApi/ChatAPI";
import AddPostAPI from "../../api/addPostApi/AddPostAPI";

const { TextArea } = Input;

interface GroupDetailsModalProps {
  open: boolean;
  onClose: () => void;
  members: string[];
  onGroupCreated: () => void;
}

const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  open,
  onClose,
  members,
  onGroupCreated,
}) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);

      const res = await AddPostAPI.uploadMedia(file);
      if (res?.data?.url) {
        setImage(res.data.url);
        message.success("Image uploaded successfully!");
      } else {
        message.error("Image upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return message.warning("Please enter a group name");
    if (members.length === 0) return message.warning("Please select members");

    try {
      setCreating(true);
      const payload = {
        members,
        name,
        description: desc,
        image,
      };

      const res = await ChatAPI.createGroup(payload);
      if (res?.data) {
        message.success("Group created");
        handleClose();
        onGroupCreated();
      }
    } catch (error) {
      console.error("Group creation failed:", error);
      message.error("Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDesc("");
    setImage(undefined);
    setUploading(false);
    setCreating(false);

    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      title={
        <span className="text-black text-base font-medium">
          Add Group Details
        </span>
      }
      width={530}
    >
      <div className="mb-5">
        <div className="text-[#000000] text-sm font-normal mb-3">
          Group Display Image
        </div>
        <div className="flex justify-start mb-4">
          <div className="relative inline-block">
            <Avatar
              size={80}
              src={image || "/images/default-chat-profile.svg"}
              className="border-none"
            />
            <div
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 bg-purple-600 text-white p-1 rounded-full shadow-lg cursor-pointer hover:bg-purple-700 transition"
            >
              {uploading ? (
                <LoadingOutlined className="text-sm p-1" />
              ) : (
                <img
                  src="/icons/image-edit-icon.svg"
                  alt="Icon"
                  className="w-6 h-6 text-sm p-1"
                />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[#000000] text-sm font-normal mb-1">
          Group Name
        </label>
        <Input
          type="text"
          placeholder="Enter group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-12 border rounded-xl px-3 py-2 text-black text-xs font-normal outline-[#8869F3]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-[#000000] text-sm font-normal mb-1">
          Group Description
        </label>
        <TextArea
          placeholder="Enter group description"
          value={desc}
          rows={3}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full border rounded-xl px-3 py-2 h-24 text-black text-xs font-normal outline-[#8869F3]"
        />
      </div>

      <button
        onClick={handleCreate}
        disabled={!name || uploading || creating}
        className="mt-2 w-full !bg-[#8869F3] text-white py-2 rounded-xl disabled:opacity-50"
      >
        {creating ? "Creating Group..." : "Create Group Chat"}
      </button>
    </Modal>
  );
};

export default GroupDetailsModal;
