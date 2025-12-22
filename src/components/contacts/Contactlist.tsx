import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatAPI from "../../api/chatApi/ChatAPI";
import { Modal, Button, message, Input, Spin, Pagination } from "antd";
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

const ContactsList: React.FC<Props> = ({}) => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 10;

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const normalizeMutualContacts = (list: any[]): Contact[] =>
    list.map((item) => ({
      grantedTo: item.grantedTo,
      user: {
        _id: item.user?._id,
        fullName: item.user?.fullName,
        username: item.user?.username,
        image: item.user?.image,
      },
    }));

  const normalizeSearchContacts = (list: any[]): Contact[] =>
    list.map((item) => ({
      grantedTo: item._id,
      user: {
        _id: item._id,
        fullName: item.fullName,
        username: item.username,
        image: item.image,
      },
    }));

  const fetchContacts = async (pageNumber = 1, keyword = "") => {
    setLoading(true);
    try {
      let data: Contact[] = [];
      let totalItems = 0;

      if (keyword.trim()) {
        const res = await PostAPI.searchShareContacts({
          q: keyword,
          page: pageNumber,
          limit,
        });
        data = normalizeSearchContacts(res.data?.data || []);
        totalItems = res.data?.total || data.length;
      } else {
        const res = await ChatAPI.getMyContacts({
          page: pageNumber,
          limit,
        });
        data = normalizeMutualContacts(res.data?.data || []);
        totalItems = res.data?.total || data.length;
      }

      setContacts(data);
      setTotal(totalItems);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      message.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts(1, search);
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setLoadingDelete(true);
    try {
      await PostAPI.RemoveContact(userToDelete._id);
      message.success("Contact Removed");
      setDeleteModalVisible(false);
      fetchContacts(page, search);
    } catch (error) {
      message.error("Failed to delete contact");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleProfileClick = (user: User) => {
    navigate(`/othersProfile/${user._id}`);
  };

  const handlePageChange = (pageNumber: number) => {
    fetchContacts(pageNumber, search);
  };

  return (
    <div className="px-3 h-full overflow-y-auto space-y-2 custom-scrollbar mr-8">
      <Input
        prefix={
          <img src="/icons/search-icon.svg" alt="Icon" className="mr-2" />
        }
        placeholder="Search"
        value={search}
        onChange={handleSearch}
        className="!h-12 !text-sm !w-full !rounded-xl custom-input focus:border-![#8869F3] hover:!border-[#8869F3]"
      />

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : contacts.length === 0 ? (
        <p className="text-center text-[#8869F3] text-base pt-8">
          No contacts found
        </p>
      ) : (
        <>
          <div className="space-y-2 mt-2">
            {contacts.map(({ user }) => {
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

          {/* AntD Pagination */}
          {total > limit && (
            <div className="flex justify-center mt-4">
              <Pagination
                current={page}
                pageSize={limit}
                total={total}
                onChange={handlePageChange}
                size="small"
                showSizeChanger={false}
                disabled={loading}
              />
            </div>
          )}
        </>
      )}

      {/* Delete Modal */}
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
            Are you sure you want to remove this contact?
          </span>
        </div>
      </Modal>
    </div>
  );
};

export default ContactsList;
