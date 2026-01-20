import React, { useState, useRef, useEffect } from "react";
import { Modal, Avatar, Input, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ChatAPI from "../../api/chatApi/ChatAPI";
import AddPostAPI from "../../api/addPostApi/AddPostAPI";

const { TextArea } = Input;

interface GroupDetailsModalProps {
  open: boolean;
  onClose: () => void;

  members?: string[];
  onGroupCreated?: () => void;

  mode?: "create" | "edit";
  chatId?: string;
  initialData?: {
    name?: string;
    description?: string;
    image?: string;
  };
}

const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  open,
  onClose,
  members,
  onGroupCreated,
  mode,
  chatId,
  initialData,
}) => {
  const isEdit = mode === "edit";

  const [name, setName] = useState(initialData?.name || "");
  const [desc, setDesc] = useState(initialData?.description || "");
  const [image, setImage] = useState<string | undefined>(initialData?.image);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && isEdit && initialData) {
      setName(initialData.name || "");
      setDesc(initialData.description || "");
      setImage(initialData.image);
    }
  }, [open, isEdit, initialData]);

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

  const handleSubmit = async () => {
    if (!name.trim()) return message.warning("Please enter a group name");

    try {
      setCreating(true);

      if (isEdit && chatId) {
        await ChatAPI.editGroupChatInfo(chatId, {
          name,
          description: desc,
          image,
        });

        message.success("Group updated");
        window.location.reload();
        onClose();
        return;
      }

      if (!members?.length) {
        return message.warning("Please select members");
      }

      await ChatAPI.createGroup({
        members,
        name,
        description: desc,
        image,
      });

      message.success("Group created");
      onClose();
      onGroupCreated?.();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Action failed");
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
          {isEdit ? "Edit Group Info" : "Add Group Details"}
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
              className="absolute bottom-0 right-0 !bg-[#8869F3] text-white p-1 rounded-full shadow-lg cursor-pointer transition"
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
          className="w-full h-[52px] border rounded-xl px-3 py-2 text-black text-xs font-normal outline-[#8869F3]"
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
          maxLength={100}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full border rounded-xl px-3 py-2 h-24 text-black text-xs font-normal outline-[#8869F3]"
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {desc.length}/100
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name || uploading || creating}
        className="h-[52px] mt-2 w-full !bg-[#8869F3] text-white rounded-xl"
      >
        {creating
          ? isEdit
            ? "Saving..."
            : "Creating Group..."
          : isEdit
            ? "Save Changes"
            : "Create Group Chat"}
      </button>
    </Modal>
  );
};

export default GroupDetailsModal;
