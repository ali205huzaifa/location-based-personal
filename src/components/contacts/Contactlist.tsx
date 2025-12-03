import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatAPI from "../../api/chatApi/ChatAPI";
import { Modal, Button, message, Input, Spin } from "antd";
import PostAPI from "../../api/postApi/PostAPI";

interface User {
  _id: string;
  fullName: string;
  username: string;
  image?: string;
}

interface Contact {
  grantedTo: string;
  user: User;
}

interface Props {
  username?: string;
}

const ContactsList: React.FC<Props> = ({ username }) => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchContacts = async (username?: string) => {
    setLoading(true);
    try {
      const response = await ChatAPI.getMyContacts(username);
      if (response && Array.isArray(response.data?.data)) {
        setContacts(response.data.data);
        setFilteredContacts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = contacts.filter(
      ({ user }) =>
        user.fullName.toLowerCase().includes(value.toLowerCase()) ||
        user.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  useEffect(() => {
    fetchContacts(username);
  }, [username]);

  const handleDelete = async () => {
    if (!userToDelete) return;

    setLoadingDelete(true);

    try {
      await PostAPI.RemoveContact(userToDelete._id);
      message.success("Contact Removed");
      setDeleteModalVisible(false);

      fetchContacts(username);
    } catch (error) {
      message.error("Failed to delete contact");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleProfileClick = (user: User) => {
    navigate(`/othersProfile/${user._id}`);
  };

  return (
    <div className="p-3 h-full overflow-y-auto space-y-2 custom-scrollbar mr-8">
      <Input
        prefix={
          <img src="/icons/search-icon.svg" alt="Icon" className="mr-2" />
        }
        placeholder="Search"
        value={search}
        onChange={handleSearch}
        className="!h-12 !text-sm !w-full !rounded-xl custom-input"
      />

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : filteredContacts.length === 0 ? (
        <p className="text-center text-gray-400 text-sm mt-3">
          No contacts found
        </p>
      ) : (
        <div className="space-y-2 mt-2">
          {filteredContacts.map(({ user }) => {
            if (!user) return null;
            const avatar = user.image || "/images/default-chat-profile.svg";

            return (
              <div
                key={user._id}
                onClick={() => handleProfileClick(user)}
                className="flex items-center justify-between py-3 rounded-lg cursor-pointer"
              >
                <div className="flex items-center space-x-3 pointer-events-auto">
                  <img
                    src={avatar}
                    alt={user.fullName}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-black text-base font-normal">
                      {user.fullName}
                    </p>
                    <p className="text-stone-500 text-sm font-normal">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <div
                  className="!text-[#FF5D5D] !text-base !font-normal cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserToDelete(user);
                    setDeleteModalVisible(true);
                  }}
                >
                  Remove
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        centered
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        closable={false}
        width={392}
        footer={
          <div className="flex gap-3">
            <Button
              key="delete"
              type="primary"
              danger
              loading={loadingDelete}
              onClick={handleDelete}
              className="flex-1 !h-10 !bg-[#FF5D5D] rounded-xl"
            >
              Yes, Remove
            </Button>
            <Button
              key="close"
              onClick={() => setDeleteModalVisible(false)}
              className="flex-1 !h-10 rounded-xl !text-[#666666] !border-[#666666]"
            >
              Cancel
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center gap-3 py-4">
          <img src="/icons/remove-icon.svg" alt="Icon" className="w-12 h-12" />
          <span className="text-center text-base font-medium px-8">
            Are you sure you want to delete this contact?
          </span>
        </div>
      </Modal>
    </div>
  );
};

export default ContactsList;
