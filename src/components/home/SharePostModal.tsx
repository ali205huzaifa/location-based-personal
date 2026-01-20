import React, { useState, useEffect } from "react";
import { Modal, Input, Checkbox, Button, Spin, message } from "antd";
import ChatAPI from "../../api/chatApi/ChatAPI";
import PostAPI from "../../api/postApi/PostAPI";
import { Pagination } from "antd";

interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

interface SharePostModalProps {
  visible: boolean;
  onClose: () => void;
  post: any | null;
}

const SharePostModal: React.FC<SharePostModalProps> = ({
  visible,
  onClose,
  post,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const normalizeMutualContacts = (list: any[]): User[] => {
    return list.map((item) => ({
      id: item.user?._id,
      name: item.user?.fullName || "Unknown",
      username: item.user?.username || "",
      avatar: item.user?.image || "",
      isMutual: true,
    }));
  };

  const normalizeSearchContacts = (list: any[]): User[] => {
    return list.map((item) => ({
      id: item._id,
      name: item.fullName || "Unknown",
      username: item.username || "",
      avatar: item.image || "",
      isMutual: item.isMutual,
    }));
  };

  const fetchContacts = async (pageNumber = 1, keyword = "") => {
    setLoading(true);
    try {
      let res;
      let usersData: User[] = [];

      if (keyword.trim()) {
        res = await PostAPI.searchShareContacts({
          search: keyword,
          page: pageNumber,
          limit,
        });

        usersData = normalizeSearchContacts(res.data?.data || []);
        setTotal(res.data?.total || usersData.length);
      } else {
        res = await ChatAPI.getMyContacts({
          page: pageNumber,
          limit,
        });

        usersData = normalizeMutualContacts(res.data?.data || []);
        setTotal(res.data.total);
      }

      setUsers(usersData);
      setPage(pageNumber);
    } catch (error) {
      console.error(error);
      message.error("Failed to load contacts");
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

  const POST_BASE_URL = "https://www.hurcle.com";

  const getPostLink = () => {
    if (!post?._id) return "";
    return `${POST_BASE_URL}/post/${post._id}`;
  };

  const handleCopyLink = () => {
    const postLink = getPostLink();

    if (!postLink) {
      message.error("Invalid post link");
      return;
    }

    navigator.clipboard.writeText(postLink);
    message.success("Post link copied to clipboard!");
  };

  const handleShare = async () => {
    if (selectedUsers.length === 0) {
      message.warning("Please select at least one contact to share with.");
      return;
    }

    const postLink = getPostLink();

    if (!postLink) {
      message.error("Invalid post link");
      return;
    }

    setLoading(true);

    try {
      await ChatAPI.sharePostWithUser({
        participants: selectedUsers,
        postLink,
      });

      message.success("Post shared successfully!");
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error(error);
      message.error("Failed to share post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setPage(1);
      fetchContacts(1, search);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setPage(1);
      fetchContacts(1, search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, visible]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    fetchContacts(pageNumber, search);
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
        prefix={
          <img src="/icons/search-icon.svg" alt="Icon" className="mr-2" />
        }
        placeholder="Search"
        allowClear
        className="rounded-xl mb-3 w-full h-11 placeholder:!text-[#666666] focus:!border-[#8869F3] hover:!border-[#8869F3] focus-within:!border-[#8869F3]"
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

      {total > limit && (
        <div className="flex justify-center mt-4">
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            onChange={handlePageChange}
            showSizeChanger={false}
            size="small"
          />
        </div>
      )}

      <div
        onClick={handleCopyLink}
        className="flex items-center cursor-pointer mt-4"
      >
        <div className="w-9 h-9 bg-white rounded-full border border-Stroke-1">
          <img src="/icons/sharelink-icon.svg" alt="Icon" className="p-2" />
        </div>
        <p className="ml-2 text-[#8869F3] text-base font-normla">
          Copy Link to Clipboard
        </p>
      </div>

      <Button
        type="primary"
        block
        size="large"
        className="mt-4 rounded-xl !bg-[#8869F3] shadow-none"
        onClick={handleShare}
        disabled={loading}
      >
        Share
      </Button>
    </Modal>
  );
};

export default SharePostModal;
