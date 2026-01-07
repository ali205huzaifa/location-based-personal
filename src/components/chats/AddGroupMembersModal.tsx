import React, { useState, useEffect } from "react";
import { Modal, Input, Checkbox, Button, Spin, message } from "antd";
import ChatAPI from "../../api/chatApi/ChatAPI";
import PostAPI from "../../api/postApi/PostAPI";
import { Pagination } from "antd";

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface SharePostModalProps {
  visible: boolean;
  onClose: () => void;
  chatId: string;
}

const AddGroupMembersModal: React.FC<SharePostModalProps> = ({
  visible,
  onClose,
  chatId,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (visible) fetchContacts();
  }, [visible]);

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

  const toggleSelect = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (visible) {
      setPage(1);
      fetchContacts(1, "");
    }
  }, [visible]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchContacts(1, search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    fetchContacts(pageNumber, search);
  };

  const handleAddMembers = async () => {
    if (!selectedUsers.length) {
      message.warning("Please select at least one member");
      return;
    }

    setLoading(true);
    try {
      const res = await ChatAPI.AddGroupMembers(chatId, selectedUsers);
      message.success(res?.data?.message || "Task successful");
      setSelectedUsers([]);
      onClose();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to add members");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={724}
      className="rounded-3xl overflow-hidden"
      styles={{ body: { padding: "0px" } }}
      title={<span className="font-semibold text-gray-800">Add Member</span>}
    >
      <Input
        prefix={
          <img src="/icons/search-icon.svg" alt="Icon" className="mr-2" />
        }
        placeholder="Search"
        allowClear
        className="mt-2 rounded-xl mb-3 w-full h-10 placeholder:!text-[#666666] focus:!border-[#8869F3] hover:!border-[#8869F3]"
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

      <Button
        type="primary"
        block
        size="large"
        className="mt-4 rounded-xl !bg-[#8869F3] shadow-none !h-12 !text-white"
        loading={loading}
        disabled={!selectedUsers.length}
        onClick={handleAddMembers}
      >
        Add
      </Button>
    </Modal>
  );
};

export default AddGroupMembersModal;
