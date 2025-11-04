import React, { useState, useRef } from "react";
import { Modal, Avatar, Input } from "antd";
import { CameraOutlined } from "@ant-design/icons";
const { TextArea } = Input;

interface GroupDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; desc: string; image?: string }) => void;
}

const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    onCreate({ name, desc, image });
    onClose();
    setName("");
    setDesc("");
    setImage(undefined);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
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
              src={image || "https://randomuser.me/api/portraits/men/32.jpg"}
              className="border-none"
            />
            <div
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 bg-purple-600 text-white p-1 rounded-full shadow-lg cursor-pointer hover:bg-purple-700 transition"
            >
              <CameraOutlined className="w-6 h-6 text-sm pl-1" />
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
        disabled={!name || !desc}
        className="mt-2 w-full bg-[#8869F3] text-white py-2 rounded-xl disabled:opacity-50"
      >
        Create Group Chat
      </button>
    </Modal>
  );
};

export default GroupDetailsModal;
