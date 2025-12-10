import React, { useState, useEffect } from "react";
import { Modal, Input, Checkbox, Button, Spin, message } from "antd";
import { LinkOutlined, SearchOutlined } from "@ant-design/icons";
import PostAPI from "../../api/postApi/PostAPI";

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

const SharePostModal: React.FC<SharePostModalProps> = ({
  visible,
  onClose,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) fetchContacts();
  }, [visible]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.warning("You must be logged in to fetch contacts.");
        setLoading(false);
        return;
      }

      const res = await PostAPI.getMyContacts();

      const contactList = Array.isArray(res.data?.contacts)
        ? res.data.contacts
        : res.data;

      const formattedUsers: User[] = contactList.map((contact: any) => ({
        id: contact.grantedTo?._id || contact._id,
        name: contact.grantedTo?.fullName || "Unknown",
        username: contact.grantedTo?.username || "",
        avatar: contact.grantedTo?.image || "",
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      message.error("Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success("Link copied to clipboard!");
  };

  const handleShare = () => {
    if (selectedUsers.length === 0) {
      message.warning("Please select at least one contact to share with.");
      return;
    }

    message.success("Post shared successfully!");
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
      className="rounded-3xl overflow-hidden"
      styles={{ body: { padding: "0px" } }}
      title={<span className="font-semibold text-gray-800">Share Post</span>}
    >
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search contacts"
        allowClear
        className="rounded-xl mb-3 w-full h-10"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin />
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleSelect(user.id)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar || "https://via.placeholder.com/40"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.username || "@user"}
                    </p>
                  </div>
                </div>
                <Checkbox checked={selectedUsers.includes(user.id)} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm mt-4">
              No contacts found.
            </p>
          )}
        </div>
      )}

      <div
        onClick={handleCopyLink}
        className="flex items-center text-sm text-[#8869F3] cursor-pointer mt-4"
      >
        <LinkOutlined className="mr-2" />
        Copy Link to Clipboard
      </div>

      <Button
        type="primary"
        block
        size="large"
        className="mt-4 rounded-xl !bg-[#8869F3]"
        onClick={handleShare}
        disabled={loading}
      >
        Share
      </Button>
    </Modal>
  );
};

export default SharePostModal;
