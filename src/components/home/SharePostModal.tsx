import React, { useState } from "react";
import { Modal, Input, Checkbox, Button } from "antd";
import { LinkOutlined } from "@ant-design/icons";

interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

interface SharePostModalProps {
  visible: boolean;
  onClose: () => void;
}

const SharePostModal: React.FC<SharePostModalProps> = ({ visible, onClose }) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const users: User[] = [
    {
      id: 1,
      name: "Kathrine Davis",
      username: "@Kathrine12",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      name: "Leatrice Handler",
      username: "@valeenyabs_",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 3,
      name: "Freida Varnes",
      username: "@belindaa",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      id: 4,
      name: "Dick Nicolas",
      username: "@katwa0",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 5,
      name: "Enrique Rutherford",
      username: "@sylviaowuor",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 6,
      name: "Leandro Barrows",
      username: "@dumakaka",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: 7,
      name: "Noah Reilly",
      username: "@noah_komen",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      className="rounded-2xl overflow-hidden"
      bodyStyle={{ padding: "20px 24px" }}
      title={<span className="font-semibold text-gray-800">Share Post</span>}
    >
      <Input
        placeholder="Search"
        allowClear
        className="rounded-full mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => toggleSelect(user.id)}
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{user.username}</p>
              </div>
            </div>
            <Checkbox checked={selectedUsers.includes(user.id)} />
          </div>
        ))}
      </div>

      <div
        onClick={handleCopyLink}
        className="flex items-center text-sm text-indigo-600 cursor-pointer mt-4"
      >
        <LinkOutlined className="mr-2" />
        Copy Link to Clipboard
      </div>

      <Button
        type="primary"
        block
        size="large"
        className="mt-4 rounded-full"
        style={{ backgroundColor: "#6A5AE0" }}
      >
        Share
      </Button>
    </Modal>
  );
};

export default SharePostModal;
